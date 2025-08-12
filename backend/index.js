const express = require('express');
const cors = require('cors'); // Import cors

require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// CORS middleware to allow requests from the frontend
app.use(cors());

app.use(express.json());







// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});