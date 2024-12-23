const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');

// Import routes
const signupRoutes = require('./authentication/signup');
const loginRoutes = require('./authentication/login');
const forgotPasswordRoutes = require('./authentication/forgot_password');
const devicesRoutes = require('./solar data/devices');
const realTimeDataRoutes = require('./solar data/real-time-data'); // New route

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(bodyParser.json());
app.use(helmet());
app.use('/static', express.static(path.join(__dirname, 'static')));

// Check for MongoDB connection string
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in the .env file');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', signupRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/auth', forgotPasswordRoutes);
app.use('/api/auth', devicesRoutes);
app.use('/api/solar', realTimeDataRoutes); // New real-time data route

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
