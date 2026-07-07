const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new SDE student
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, avatar, collegeName, department, gradYear, rollNumber } = req.body;

    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({ success: false, message: 'Student already exists' });
    }

    const student = await Student.create({
      name,
      email,
      password,
      avatar: avatar || '🧙',
      collegeName: collegeName || '',
      department: department || '',
      gradYear: gradYear || null,
      rollNumber: rollNumber || ''
    });

    if (student) {
      res.status(201).json({
        success: true,
        token: generateToken(student._id),
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          avatar: student.avatar,
          rank: student.rank,
          xp: student.xp,
          coins: student.coins,
          streak: student.streak,
          classType: student.classType,
          unlockedSkills: student.unlockedSkills,
          heistLevelsCompleted: student.heistLevelsCompleted,
          aptiHighScore: student.aptiHighScore,
          collegeName: student.collegeName,
          department: student.department,
          gradYear: student.gradYear,
          rollNumber: student.rollNumber
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid student registration data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate student & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email }).select('+password');
    if (student && (await student.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(student._id),
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          avatar: student.avatar,
          rank: student.rank,
          xp: student.xp,
          coins: student.coins,
          streak: student.streak,
          classType: student.classType,
          unlockedSkills: student.unlockedSkills,
          heistLevelsCompleted: student.heistLevelsCompleted,
          aptiHighScore: student.aptiHighScore,
          collegeName: student.collegeName,
          department: student.department,
          gradYear: student.gradYear,
          rollNumber: student.rollNumber
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in student profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.student.id);
    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/auth/progress
// @desc    Update student XP, Coins, unlocked skills list, and classType
// @access  Private
router.put('/progress', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.student.id);

    if (student) {
      // Safely update parameters if sent in body
      if (req.body.xp !== undefined) student.xp = req.body.xp;
      if (req.body.coins !== undefined) student.coins = req.body.coins;
      if (req.body.streak !== undefined) student.streak = req.body.streak;
      if (req.body.classType !== undefined) student.classType = req.body.classType;
      if (req.body.unlockedSkills !== undefined) student.unlockedSkills = req.body.unlockedSkills;
      if (req.body.heistLevelsCompleted !== undefined) student.heistLevelsCompleted = req.body.heistLevelsCompleted;
      if (req.body.aptiHighScore !== undefined) student.aptiHighScore = req.body.aptiHighScore;

      // Dynamically rank up based on XP
      const level = Math.floor(student.xp / 100) + 1;
      if (level >= 10) {
        student.rank = 'CTO / Architect';
      } else if (level >= 7) {
        student.rank = 'Lead SDE Engineer';
      } else if (level >= 4) {
        student.rank = 'Senior Developer';
      } else if (level >= 2) {
        student.rank = 'Junior SDE';
      } else {
        student.rank = 'SDE Recruit';
      }

      const updatedStudent = await student.save();
      res.json({ success: true, student: updatedStudent });
    } else {
      res.status(404).json({ success: false, message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
