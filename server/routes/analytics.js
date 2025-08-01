const express = require('express');
const router = express.Router();

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {},
      message: 'Analytics endpoint - coming soon'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;