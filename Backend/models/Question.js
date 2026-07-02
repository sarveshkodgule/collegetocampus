const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['sql-heist', 'algo-arena', 'apti-rush']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctAnswer: {
    type: Number,
    required: true // Index of the correct option (0-3)
  },
  tip: {
    type: String,
    default: ''
  },
  extraDetails: {
    type: mongoose.Schema.Types.Mixed, // For custom SQL tables or test inputs
    default: {}
  }
});

// Speed up database queries filter lookups
QuestionSchema.index({ category: 1, difficulty: 1 });

module.exports = mongoose.model('Question', QuestionSchema);
