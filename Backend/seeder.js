const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const Question = require('./models/Question');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🟢 Connected to MongoDB Atlas successfully!');

    await Question.deleteMany({});
    console.log('🧹 Purged old questions from collection.');

    const seedQuestions = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'seedData.json'), 'utf8')
    );
    
    const seeded = await Question.insertMany(seedQuestions);
    console.log(`✅ Successfully seeded ${seeded.length} questions into MongoDB Atlas!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
