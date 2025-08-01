const express = require('express');
const router = express.Router();

// @desc    Get user assets
// @route   GET /api/assets
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: [],
      message: 'Assets endpoint - coming soon'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;