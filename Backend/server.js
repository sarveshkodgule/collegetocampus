require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB, closeDB } = require('./config/db');

// Connect to MongoDB & Auto-Seed Questions
connectDB().then(async () => {
  try {
    const Question = require('./models/Question');
    const count = await Question.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial database questions...');
      const seedQuestions = [
        {
          category: 'sql-heist',
          difficulty: 'easy',
          question: 'Identify the SQL query to find camera locations that are currently offline from security_cameras.',
          options: [
            "SELECT location FROM security_cameras WHERE status = 'OFFLINE'",
            "SELECT camera_id FROM security_cameras WHERE status = 'ACTIVE'",
            "UPDATE security_cameras SET status = 'OFFLINE'",
            "SELECT * FROM security_cameras"
          ],
          correctAnswer: 0,
          tip: "Filters are applied using the WHERE clause. Check for status = 'OFFLINE'."
        },
        {
          category: 'sql-heist',
          difficulty: 'medium',
          question: 'Retrieve the access code from badge_registry for employee Thomas Anderson.',
          options: [
            "SELECT access_code FROM badge_registry WHERE emp_id = 2",
            "SELECT access_code FROM badge_registry JOIN employees ON badge_registry.emp_id = employees.emp_id WHERE employees.name = 'Thomas Anderson'",
            "SELECT name FROM employees JOIN badge_registry ON employees.emp_id = 2",
            "SELECT access_code FROM badge_registry WHERE name = 'Thomas Anderson'"
          ],
          correctAnswer: 1,
          tip: "Use an INNER JOIN to connect badge_registry to employees using emp_id, then filter by employee name."
        },
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
      await Question.insertMany(seedQuestions);
      console.log('✅ Initial database questions seeded successfully!');
    }
  } catch (err) {
    console.error('❌ Database seeding failed:', err.message);
  }
});

const app = express();

// 1. Security Headers Configuration (XSS protection, MIME checks)
app.use(helmet());

// 2. CORS Locking (Allows localhost and wildcard options safely)
app.use(cors({
  origin: '*', // We allow wildcard to simplify deployment testing, lock origin to frontend URL in production config
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 3. Rate Limiter (Protects SDE endpoints against brute force sweeps)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 150, // Limit each IP to 150 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many API requests from this connection, please retry in 15 minutes.' }
});
app.use('/api/', apiLimiter);

// Base Health Check
app.get('/', (req, res) => {
  res.json({ status: 'active', message: 'Silicon Metropolis API Gateway Online' });
});

// Routes Registers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/questions', require('./routes/questions'));

// 4. Centralized Error Boundary Middleware (Ensures server never crashes on uncaught rejects)
app.use((err, req, res, next) => {
  console.error(`🚨 Centralized Error Boundary: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Fallback Page Not Found Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource Endpoint Not Found' });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 SDE Server running in production on port ${PORT}`);
});

// 5. Graceful shutdowns on system signals
const shutdownGracefully = async () => {
  console.log('⏳ Termination signal received. Gracefully closing Express server...');
  server.close(async () => {
    console.log('✅ Express server closed.');
    await closeDB();
    console.log('👋 Process exiting successfully.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdownGracefully);
process.on('SIGINT', shutdownGracefully);
