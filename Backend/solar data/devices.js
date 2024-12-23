const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticate = require('../authenticate/authenticate'); // Corrected path for the authentication middleware

// API to fetch user devices
router.get('/user-devices', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return devices directly
    res.status(200).json({ success: true, devices: user.devices });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ message: 'Failed to fetch devices' });
  }
});

module.exports = router;
