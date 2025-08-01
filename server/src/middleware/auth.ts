import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

// JWT authentication middleware
const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'אין אישור גישה, נדרש טוקן'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gamecraft-secret') as any;
    const user = await User.findById(decoded.userId).select('+password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'טוקן לא תקין או משתמש לא פעיל'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'טוקן לא תקין'
    });
  }
};

// Admin role middleware
export const adminRequired = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'נדרשות הרשאות מנהל'
    });
  }
  next();
};

// Subscription level middleware
export const subscriptionRequired = (requiredLevel: string) => {
  const levelHierarchy = {
    'free': 0,
    'basic': 1,
    'pro': 2,
    'ultimate': 3
  };

  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'נדרש אימות'
      });
    }

    const userLevel = levelHierarchy[req.user.subscription.plan as keyof typeof levelHierarchy] || 0;
    const requiredLevelNum = levelHierarchy[requiredLevel as keyof typeof levelHierarchy] || 0;

    if (userLevel < requiredLevelNum) {
      return res.status(403).json({
        success: false,
        message: `נדרש מנוי ברמת ${requiredLevel} ומעלה`,
        requiredPlan: requiredLevel,
        currentPlan: req.user.subscription.plan
      });
    }

    next();
  };
};

// Admin access code verification
export const adminAccessCode = (req: AuthRequest, res: Response, next: NextFunction) => {
  const accessCode = req.header('Admin-Access-Code');
  const validCode = 'lotemronkaplan21';
  
  if (accessCode === validCode) {
    // Grant admin access
    if (req.user) {
      req.user.role = 'admin';
    }
    next();
  } else if (req.user?.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'נדרש קוד גישה למנהל'
    });
  }
};

export default authMiddleware;