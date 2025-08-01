const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Protect routes - require authentication
const requireAuth = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'No user found with this token'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'User account is deactivated'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error in authentication'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Admin access - requires admin role or special access code
const requireAdmin = (req, res, next) => {
  // Check if user has admin role
  if (req.user.role === 'admin') {
    return next();
  }

  // Check for admin access code in headers
  const adminCode = req.headers['x-admin-code'];
  const validAdminCode = process.env.ADMIN_ACCESS_CODE || 'lotemronkaplan21';

  if (adminCode === validAdminCode) {
    // Temporarily grant admin access for this request
    req.user.tempAdmin = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Admin access required. Provide admin credentials or access code.'
  });
};

// Optional auth - don't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token invalid, but continue without user
        logger.warn('Invalid token in optional auth:', error.message);
      }
    }

    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    next();
  }
};

// Rate limiting for sensitive operations
const sensitiveOperation = (req, res, next) => {
  // Add additional security checks for sensitive operations
  if (req.user) {
    const now = new Date();
    const lastSensitiveOp = req.user.lastSensitiveOperation;
    
    // Minimum 1 minute between sensitive operations
    if (lastSensitiveOp && (now - lastSensitiveOp) < 60000) {
      return res.status(429).json({
        success: false,
        error: 'Please wait before performing another sensitive operation'
      });
    }
  }
  
  next();
};

module.exports = {
  requireAuth,
  authorize,
  requireAdmin,
  optionalAuth,
  sensitiveOperation
};