const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// @route   GET /api/questions
// @desc    Get questions by category and difficulty
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter);
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/questions/seed
// @desc    Seed initial placement questions bank
// @access  Public
router.post('/seed', async (req, res) => {
  try {
    // Delete existing questions first to prevent duplicates
    await Question.deleteMany({});

    const seedQuestions = [
      // SQL Heist Questions
      {
        category: 'sql-heist',
        difficulty: 'easy',
        question: 'Identify the SQL query to find camera locations that are currently offline from security_cameras.',
        options: [
          'SELECT location FROM security_cameras WHERE status = \'OFFLINE\'',
          'SELECT camera_id FROM security_cameras WHERE status = \'ACTIVE\'',
          'UPDATE security_cameras SET status = \'OFFLINE\'',
          'SELECT * FROM security_cameras'
        ],
        correctAnswer: 0,
        tip: 'Filters are applied using the WHERE clause. Check for status = \'OFFLINE\'.'
      },
      {
        category: 'sql-heist',
        difficulty: 'medium',
        question: 'Retrieve the access code from badge_registry for employee Thomas Anderson.',
        options: [
          'SELECT access_code FROM badge_registry WHERE emp_id = 2',
          'SELECT access_code FROM badge_registry JOIN employees ON badge_registry.emp_id = employees.emp_id WHERE employees.name = \'Thomas Anderson\'',
          'SELECT name FROM employees JOIN badge_registry ON employees.emp_id = 2',
          'SELECT access_code FROM badge_registry WHERE name = \'Thomas Anderson\''
        ],
        correctAnswer: 1,
        tip: 'Use an INNER JOIN to connect badge_registry to employees using emp_id, then filter by employee name.'
      },

      // Algo Arena Questions
      {
        category: 'algo-arena',
        difficulty: 'easy',
        question: 'What is the time complexity to retrieve an array element directly using its memory index?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 0,
        tip: 'Array lookups use direct memory offsets, resolving instantly in constant O(1) time.'
      },
      {
        category: 'algo-arena',
        difficulty: 'medium',
        question: 'Which divide-and-conquer sorting algorithm guarantees a worst-case O(n log n) complexity and preserves element stability?',
        options: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Bubble Sort'],
        correctAnswer: 1,
        tip: 'Merge Sort divides arrays recursively, merging them in O(n log n) time while maintaining stability.'
      },

      // Apti Rush Questions
      {
        category: 'apti-rush',
        difficulty: 'easy',
        question: 'Worker A can build a firewall in 12 hours, and Worker B takes 24 hours. Working together, how long will they take?',
        options: ['6 hours', '8 hours', '10 hours', '12 hours'],
        correctAnswer: 1,
        tip: 'Use the combined work formula: (A × B) / (A + B). In this case: (12 × 24) / (12 + 24) = 288 / 36 = 8 hours.'
      },
      {
        category: 'apti-rush',
        difficulty: 'medium',
        question: 'Convert a server connection download rate of 72 km/h into meters per second equivalents.',
        options: ['15 m/s', '20 m/s', '25 m/s', '30 m/s'],
        correctAnswer: 1,
        tip: 'To convert km/h to m/s, multiply the rate by 5/18. Here: 72 × (5/18) = 4 × 5 = 20 m/s.'
      }
    ];

    const seeded = await Question.insertMany(seedQuestions);
    res.json({ success: true, message: 'Seeded questions successfully!', count: seeded.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
