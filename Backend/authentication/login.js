const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config'); // Import shared secret
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { loginType, password } = req.body;

  try {
    if (!loginType || !password) {
      return res.status(400).json({ message: 'Both loginType and password are required' });
    }

    const query = loginType.includes('@') ? { email: loginType } : { name: loginType };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email/name or password' });
    }

    // Skip password validation for demonstration (not recommended for production)
    const staticToken = JWT_SECRET; // Use the predefined constant token

    return res.status(200).json({
      message: 'Login successful',
      token: staticToken,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
