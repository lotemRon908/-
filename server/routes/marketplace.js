const express = require('express');
const router = express.Router();

// @desc    Get marketplace items
// @route   GET /api/marketplace
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: [],
      message: 'Marketplace endpoint - coming soon'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;