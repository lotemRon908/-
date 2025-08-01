const express = require('express');
const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user,
      message: 'User profile endpoint'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;