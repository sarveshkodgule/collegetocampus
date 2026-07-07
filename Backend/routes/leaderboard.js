const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// @route   GET /api/leaderboard
// @desc    Get student ranks sorted by XP descending
// @access  Public
router.get('/', async (req, res) => {
  try {
    const ranks = await Student.find({})
      .select('name avatar rank xp classType email')
      .sort({ xp: -1 })
      .limit(100); // Return top 100 players

    res.json({ success: true, leaderboard: ranks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
