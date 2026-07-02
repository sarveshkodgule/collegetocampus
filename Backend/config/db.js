const mongoose = require('mongoose');

const connectDB = async (retryCount = 5) => {
  const options = {
    autoIndex: true, // Auto-build indexes in background
  };

  for (let i = 1; i <= retryCount; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, options);
      console.log(`📡 Cloud MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`🚨 Connection attempt ${i} failed. Error: ${error.message}`);
      if (i === retryCount) {
        console.error('❌ Critical: Maximum database connection retries reached. Shutting down.');
        process.exit(1);
      }
      console.log(`⏳ Waiting 5 seconds before retrying connection...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Handle graceful connection terminations on process exits
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed gracefully on process termination.');
  } catch (err) {
    console.error(`🚨 Error closing MongoDB connection: ${err.message}`);
  }
};

module.exports = { connectDB, closeDB };
