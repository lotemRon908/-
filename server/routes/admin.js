const express = require('express');
const User = require('../models/User');
const logger = require('../utils/logger');

const router = express.Router();

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
router.get('/stats', async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        adminUsers,
        recentUsers,
        gamesCreated: 0, // TODO: Implement when Game model exists
        securityChecks: 456,
        securityIncidents: 0
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private (Admin)
router.get('/users', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user role/status (admin)
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
router.put('/users/:id', async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    logger.info(`Admin ${req.user.email} updated user ${user.email}: role=${role}, active=${isActive}`);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
router.delete('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Prevent deleting other admins
    if (user.role === 'admin' && req.user.id !== user.id) {
      return res.status(403).json({
        success: false,
        error: 'Cannot delete other admin users'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    logger.info(`Admin ${req.user.email} deleted user ${user.email}`);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get system logs (admin)
// @route   GET /api/admin/logs
// @access  Private (Admin)
router.get('/logs', async (req, res, next) => {
  try {
    // TODO: Implement log reading from files
    res.json({
      success: true,
      data: [
        { level: 'info', message: 'User logged in: demo@gamecraft.com', timestamp: new Date() },
        { level: 'info', message: 'New user registered: test@example.com', timestamp: new Date() },
        { level: 'warn', message: 'Rate limit exceeded for IP: 127.0.0.1', timestamp: new Date() }
      ],
      message: 'System logs endpoint'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;