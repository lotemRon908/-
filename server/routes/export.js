const express = require('express');
const router = express.Router();

// @desc    Export game to platform
// @route   POST /api/export/:gameId
// @access  Private
router.post('/:gameId', async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Game export - coming soon'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;