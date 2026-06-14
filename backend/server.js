const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const scanRoutes = require('./routes/scan'); // Import the scanner router

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Wiring
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes); // This maps /api/scan/analyze to your scan router

// Database Connection
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`)))
  .catch(err => console.error('MongoDB connection error:', err));