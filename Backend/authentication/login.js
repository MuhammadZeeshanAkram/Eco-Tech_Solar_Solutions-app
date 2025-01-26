const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = process.env; // Load JWT_SECRET from .env
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

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email/name or password' });
    }

    // Respond with the static token from .env
    res.status(200).json({
      message: 'Login successful',
      token: JWT_SECRET, // Use the static token from .env
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
