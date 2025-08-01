import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import authMiddleware, { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Generate JWT token
const generateToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'gamecraft-secret',
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('שם המשתמש חייב להיות בין 3 ל-30 תווים')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('שם המשתמש יכול להכיל רק אותיות אנגליות, מספרים וקו תחתון'),
  body('email')
    .isEmail()
    .withMessage('כתובת המייל לא תקינה')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('הסיסמה חייבת להיות לפחות 8 תווים')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('הסיסמה חייבת להכיל אות גדולה, אות קטנה ומספר'),
  body('firstName')
    .notEmpty()
    .withMessage('שם פרטי נדרש')
    .isLength({ max: 50 })
    .withMessage('שם פרטי לא יכול להיות יותר מ-50 תווים'),
  body('lastName')
    .notEmpty()
    .withMessage('שם משפחה נדרש')
    .isLength({ max: 50 })
    .withMessage('שם משפחה לא יכול להיות יותר מ-50 תווים')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'שגיאות ולידציה',
        errors: errors.array()
      });
    }

    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email.toLowerCase() 
          ? 'כתובת המייל כבר קיימת במערכת' 
          : 'שם המשתמש כבר תפוס'
      });
    }

    // Create user
    const user = new User({
      username,
      email: email.toLowerCase(),
      password,
      firstName,
      lastName
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'משתמש נוצר בהצלחה',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאת שרת פנימית'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('login')
    .notEmpty()
    .withMessage('נדרש שם משתמש או מייל'),
  body('password')
    .notEmpty()
    .withMessage('נדרשת סיסמה')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'שגיאות ולידציה',
        errors: errors.array()
      });
    }

    const { login, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: login.toLowerCase() },
        { username: login }
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'פרטי התחברות שגויים'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'פרטי התחברות שגויים'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'חשבון המשתמש אינו פעיל'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: 'התחברות בוצעה בהצלחה',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subscription: user.subscription,
        gameStats: user.gameStats,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאת שרת פנימית'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user?._id)
      .populate('projects', 'title description category createdAt')
      .populate('collaborations', 'title description category createdAt');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאת שרת פנימית'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, [
  body('firstName').optional().isLength({ max: 50 }),
  body('lastName').optional().isLength({ max: 50 }),
  body('profile.bio').optional().isLength({ max: 500 }),
  body('profile.location').optional().isLength({ max: 100 }),
  body('profile.website').optional().isURL()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'שגיאות ולידציה',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'משתמש לא נמצא'
      });
    }

    // Update fields
    const allowedFields = ['firstName', 'lastName', 'profile', 'preferences'];
    Object.keys(req.body).forEach(field => {
      if (allowedFields.includes(field)) {
        if (field === 'profile' || field === 'preferences') {
          user[field] = { ...user[field], ...req.body[field] };
        } else {
          user[field] = req.body[field];
        }
      }
    });

    await user.save();

    res.json({
      success: true,
      message: 'פרופיל עודכן בהצלחה',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאת שרת פנימית'
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', authMiddleware, [
  body('currentPassword').notEmpty().withMessage('נדרשת סיסמה נוכחית'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('הסיסמה החדשה חייבת להיות לפחות 8 תווים')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('הסיסמה החדשה חייבת להכיל אות גדולה, אות קטנה ומספר')
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'שגיאות ולידציה',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'משתמש לא נמצא'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'הסיסמה הנוכחית שגויה'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'סיסמה שונתה בהצלחה'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאת שרת פנימית'
    });
  }
});

export default router;