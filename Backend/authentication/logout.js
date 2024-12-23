const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config'); // Import shared secret
const User = require('../models/User');

// Logout Route
router.post('/logout', (req, res) => {
    try {
      // Placeholder for token invalidation logic (if needed)
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).json({ message: 'Logout failed' });
    }
  });

 module.exports = router;