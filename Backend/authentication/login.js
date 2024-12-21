const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// User schema
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
});

const User = mongoose.models.solarusers || mongoose.model('solarusers', userSchema, 'solarusers');

// Login Route
router.post('/login', async (req, res) => {
  const { loginType, password } = req.body;

  try {
    if (!loginType || !password) {
      return res.status(400).json({ message: 'Both loginType and password are required' });
    }

    // Determine login field (email or name)
    const query = loginType.includes('@') ? { email: loginType } : { name: loginType };

    // Find user by email or name
    const user = await User.findOne(query);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email/name or password' });
    }

    // Validate password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email/name or password' });
    }

    // Successful login
    res.status(200).json({ message: 'Login successful', user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
