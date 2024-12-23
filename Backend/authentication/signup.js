const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password hashing
const User = require('../models/User'); // Adjust the path to your models directory

// Signup route
router.post('/signup', async (req, res) => {
  const { email, name, devices, password, confirmPassword } = req.body;

  // Validation logic here...

  try {
    // Logic for checking duplicates, hashing the password, and saving the user...
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, name, devices, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error saving user:', error);

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `Duplicate value for field: ${duplicateField}` });
    }

    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
