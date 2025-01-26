const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config(); // Load .env variables
const JWT_SECRET = process.env.JWT_SECRET; // Load JWT_SECRET

// Login Route
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

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email/name or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET // Use JWT_SECRET from .env
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
