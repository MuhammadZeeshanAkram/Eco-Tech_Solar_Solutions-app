const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config(); // Load .env variables
const JWT_SECRET = process.env.JWT_SECRET; // Load JWT_SECRET

// Middleware for authenticating the token
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing Bearer Token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
    req.user = decoded; // Attach decoded token to request
    next();
  } catch (error) {
    console.error('Token Verification Error:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Route to fetch user information
router.get('/user-info', authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the token
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      devices: user.devices || [],
    });
  } catch (err) {
    console.error('Error fetching user info:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
