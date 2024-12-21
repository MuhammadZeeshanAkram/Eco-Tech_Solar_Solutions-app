const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define the user schema for the "solarusers" collection
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  sn: { type: String, required: true, unique: true },
  tokenId: { type: String, required: true },
  password: { type: String, required: true },
});

// Define the model using the "solarusers" collection
const User = mongoose.models.solarusers || mongoose.model('solarusers', userSchema, 'solarusers');

// Signup route
router.post('/signup', async (req, res) => {
  const { email, name, sn, tokenId, password, confirmPassword } = req.body;

  // Validation: Check if all fields are present
  if (!email || !name || !sn || !tokenId || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate password match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Validate email format (basic regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Check for duplicate email or sn
    const existingUser = await User.findOne({
      $or: [{ email }, { sn }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already registered' });
      } else if (existingUser.sn === sn) {
        return res.status(400).json({ message: 'Serial number already registered' });
      }
    }

    // Save the user in the "solarusers" collection
    const newUser = new User({ email, name, sn, tokenId, password });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error saving user:', error);

    // Handle duplicate key error (MongoDB unique constraint)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `Duplicate value for field: ${duplicateField}` });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
