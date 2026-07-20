const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// @route   GET /api/questions
// @desc    Get randomized, shuffled questions by category and difficulty
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, limit = 10, excludeIds } = req.query;
    const match = {};

    if (category) match.category = category;
    if (difficulty) match.difficulty = difficulty;

    if (excludeIds) {
      const idsArray = excludeIds.split(',').filter(id => id && id.length === 24);
      if (idsArray.length > 0) {
        const mongoose = require('mongoose');
        match._id = { $nin: idsArray.map(id => new mongoose.Types.ObjectId(id)) };
      }
    }

    // Use $sample pipeline to retrieve a randomized, shuffled subset of questions
    let questions = await Question.aggregate([
      { $match: match },
      { $sample: { size: parseInt(limit) } }
    ]);

    // Fallback: If exclude filter resulted in zero questions (pool exhausted), retry without exclude filter
    if (questions.length === 0 && excludeIds) {
      delete match._id;
      questions = await Question.aggregate([
        { $match: match },
        { $sample: { size: parseInt(limit) } }
      ]);
    }

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/questions/seed
// @desc    Seed initial placement questions bank from JSON configuration file
// @access  Public
router.post('/seed', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');

    // Delete existing questions first to prevent duplicates
    await Question.deleteMany({});

    const seedDataPath = path.join(__dirname, '../seedData.json');
    const seedQuestions = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

    const seeded = await Question.insertMany(seedQuestions);
    res.json({ success: true, message: 'Seeded questions successfully!', count: seeded.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
