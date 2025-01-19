const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config(); // Load environment variables

// Import routes
const signupRoutes = require('./authentication/signup');
const loginRoutes = require('./authentication/login');
const forgotPasswordRoutes = require('./authentication/forgot_password');
const signoutRoutes = require('./authentication/logout');
const profileRoutes = require('./authentication/profile');
const devicesRoutes = require('./solar data/devices');
const realTimeDataRoutes = require('./solar data/real-time-data');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from environment or default to 5000

// Middleware: Enhanced CORS configuration
app.use(
  cors({
    origin: [
      'http://localhost:3000', // Local frontend
      'http://127.0.0.1:3000', // Alternate localhost
      'http://10.0.2.2:3000', // Android emulator
      'http://localhost', // Flutter in browser
      'https://eco-tech-solar-solutions-app.onrender.com', // Deployed backend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true, // Allow cookies if required
  })
);

// Middleware
app.use(bodyParser.json());
app.use(helmet());
app.use('/static', express.static(path.join(__dirname, 'static')));

// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in the .env file.');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process on connection failure
  });

// Routes
app.use('/api/auth', signupRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/auth', forgotPasswordRoutes);
app.use('/api/auth', signoutRoutes);
app.use('/api/auth', profileRoutes);
app.use('/api/auth', devicesRoutes);
app.use('/api/solar', realTimeDataRoutes);

// Catch-all route for unmatched requests
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err.stack || err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
