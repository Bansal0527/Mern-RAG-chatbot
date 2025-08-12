const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURL = process.env.MONGODB_URL;
    console.log('Attempting to connect to:', mongoURL);

    await mongoose.connect(mongoURL); // No options needed for Mongoose 6+

    console.log(`MongoDB Connected`);


  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
