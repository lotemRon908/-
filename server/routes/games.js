const express = require('express');
const router = express.Router();

// @desc    Get all games for user
// @route   GET /api/games
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    // TODO: Implement game fetching
    res.json({
      success: true,
      data: [],
      message: 'Games endpoint - coming soon'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new game
// @route   POST /api/games
// @access  Private
router.post('/', async (req, res, next) => {
  try {
    // TODO: Implement game creation
    res.json({
      success: true,
      message: 'Game creation - coming soon'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;