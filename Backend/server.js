const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
require('dotenv').config(); // Load environment variables

// Import authentication routes
const signupRoutes = require('./authentication/signup');
const loginRoutes = require('./authentication/login'); // Add login route
const forgotPasswordRoutes = require('./authentication/forgot_password');



const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for port if available

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(helmet()); // Add Helmet for security

// Ensure MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1); // Exit the application
}

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Authentication routes
app.use('/api/auth', signupRoutes);
app.use('/api/auth', loginRoutes); // Add login route
app.use('/api/auth', forgotPasswordRoutes);

// Route to fetch real-time data from Solax Cloud API
app.post('/api/realtime-data', async (req, res) => {
  try {
    const { tokenId, sn } = req.body;

    if (!tokenId || !sn) {
      return res.status(400).json({ message: 'Token ID and SN are required' });
    }

    const url = `https://www.solaxcloud.com:9443/proxy/api/getRealtimeInfo.do?tokenId=${tokenId}&sn=${sn}`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
