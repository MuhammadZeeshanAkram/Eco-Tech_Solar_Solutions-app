const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config'); // Import shared secret
const User = require('../models/User');

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
    // `req.user` is set by the `authenticate` middleware
    const userId = req.user.id;

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with user data
    res.status(200).json({
      name: user.name,
      email: user.email,
      devices: user.devices || [], // Default to empty array if no devices
    });
  } catch (err) {
    console.error('Error fetching user info:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
