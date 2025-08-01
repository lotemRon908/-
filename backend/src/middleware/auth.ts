import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomError } from './errorHandler';
import { UserService } from '../services/userService';
import { CacheService } from '../config/redis';
import { logger } from '../config/logger';

interface AuthenticatedRequest extends Request {
  user?: any;
}

const userService = new UserService();
const cacheService = new CacheService();

// JWT Authentication Middleware
export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new CustomError('Access token required', 401, 'TOKEN_REQUIRED');
    }

    // Check if token is blacklisted
    const isBlacklisted = await cacheService.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new CustomError('Token has been revoked', 401, 'TOKEN_REVOKED');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Check if user exists in cache first
    let user = await cacheService.get(`user:${decoded.userId}`);
    
    if (!user) {
      // Get user from database
      user = await userService.findById(decoded.userId);
      if (!user) {
        throw new CustomError('User not found', 401, 'USER_NOT_FOUND');
      }
      
      // Cache user for 1 hour
      await cacheService.set(`user:${decoded.userId}`, user, 3600);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new CustomError('Account is deactivated', 403, 'ACCOUNT_DEACTIVATED');
    }

    req.user = user;
    
    // Log user activity
    logger.userActivity(user.id, 'API_ACCESS', {
      endpoint: req.originalUrl,
      method: req.method,
      ip: req.ip
    });

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.security('Invalid JWT token', {
        error: error.message,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      return next(new CustomError('Invalid token', 401, 'INVALID_TOKEN'));
    }
    next(error);
  }
}

// Optional Authentication (for endpoints that work with or without auth)
export async function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await userService.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Don't throw error for optional auth, just continue without user
    next();
  }
}

// Role-based Authorization
export function authorize(roles: string[] = []) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new CustomError('Authentication required', 401, 'AUTH_REQUIRED'));
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      logger.security('Unauthorized role access attempt', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: roles,
        endpoint: req.originalUrl
      });
      return next(new CustomError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS'));
    }

    next();
  };
}

// Admin Authentication (special code required)
export function authenticateAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const adminCode = req.headers['x-admin-code'] as string;
  
  if (!adminCode || adminCode !== process.env.ADMIN_CODE) {
    logger.security('Invalid admin code attempt', {
      providedCode: adminCode,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl
    });
    return next(new CustomError('Invalid admin code', 403, 'INVALID_ADMIN_CODE'));
  }

  // Set admin user
  req.user = {
    id: 'admin',
    role: 'admin',
    email: 'admin@gamecrfat-pro.com',
    isAdmin: true
  };

  logger.userActivity('admin', 'ADMIN_ACCESS', {
    endpoint: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  next();
}

// Email Verification Requirement
export function requireEmailVerification(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    return next(new CustomError('Authentication required', 401, 'AUTH_REQUIRED'));
  }

  if (!req.user.isEmailVerified) {
    return next(new CustomError('Email verification required', 403, 'EMAIL_NOT_VERIFIED'));
  }

  next();
}

// Subscription/Plan Check
export function requireSubscription(plans: string[] = ['basic', 'pro', 'enterprise']) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new CustomError('Authentication required', 401, 'AUTH_REQUIRED'));
    }

    if (!plans.includes(req.user.subscription?.plan || 'free')) {
      return next(new CustomError('Subscription upgrade required', 402, 'SUBSCRIPTION_REQUIRED'));
    }

    // Check if subscription is active
    if (req.user.subscription?.status !== 'active') {
      return next(new CustomError('Subscription is not active', 402, 'SUBSCRIPTION_INACTIVE'));
    }

    next();
  };
}

// Rate Limiting per User
export function userRateLimit(limit: number = 100, windowMs: number = 900000) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return next();
    }

    try {
      const key = `rate_limit:user:${req.user.id}`;
      const result = await cacheService.isRateLimited(key, limit, Math.floor(windowMs / 1000));

      if (result.limited) {
        logger.security('User rate limit exceeded', {
          userId: req.user.id,
          limit,
          endpoint: req.originalUrl
        });
        return next(new CustomError('Rate limit exceeded', 429, 'USER_RATE_LIMIT_EXCEEDED'));
      }

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(Date.now() + windowMs).toISOString()
      });

      next();
    } catch (error) {
      next(error);
    }
  };
}

// API Key Authentication (for external integrations)
export async function authenticateApiKey(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new CustomError('API key required', 401, 'API_KEY_REQUIRED');
    }

    // Validate API key and get associated user
    const user = await userService.findByApiKey(apiKey);
    
    if (!user) {
      logger.security('Invalid API key attempt', {
        apiKey: apiKey.substring(0, 8) + '...',
        ip: req.ip,
        endpoint: req.originalUrl
      });
      throw new CustomError('Invalid API key', 401, 'INVALID_API_KEY');
    }

    if (!user.isActive) {
      throw new CustomError('Account is deactivated', 403, 'ACCOUNT_DEACTIVATED');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}