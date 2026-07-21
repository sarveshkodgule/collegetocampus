const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// @route   GET /api/leaderboard
// @desc    Get student ranks sorted by XP descending
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Purge corrupted Google URL test accounts from database
    await Student.deleteMany({ name: { $regex: '^https?://', $options: 'i' } });

    const ranks = await Student.find({})
      .select('name avatar rank xp classType email')
      .sort({ xp: -1 })
      .limit(100);

    const cleanRanks = ranks.map(student => {
      const doc = student.toObject ? student.toObject() : student;
      return {
        ...doc,
        name: (doc.name && doc.name.startsWith('http')) ? 'SDE Candidate' : (doc.name || 'SDE Candidate'),
        avatar: (doc.avatar && doc.avatar.startsWith('http')) ? '🧙' : (doc.avatar || '🚀'),
        xp: typeof doc.xp === 'number' ? doc.xp : parseInt(doc.xp || 0, 10)
      };
    });

    res.json({ success: true, leaderboard: cleanRanks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
