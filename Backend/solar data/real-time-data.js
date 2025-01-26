const express = require('express');
const router = express.Router();
const cors = require('cors');
const axios = require('axios');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config'); // Import shared secret

// Apply CORS to this route
router.use(cors());

// Middleware for authenticating JWT
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing Bearer Token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token Verification Error:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Route to fetch real-time data
router.get('/realtime-data', authenticate, async (req, res) => {
  try {
    const { deviceSN } = req.query;

    if (!deviceSN) {
      return res.status(400).json({ success: false, message: 'Device SN is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const device = user.devices.find((d) => d.sn === deviceSN);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found for this user' });
    }

    const { tokenId, sn } = device;
    const url = `https://www.solaxcloud.com:9443/proxy/api/getRealtimeInfo.do?tokenId=${encodeURIComponent(tokenId)}&sn=${encodeURIComponent(sn)}`;

    const response = await axios.get(url, {
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'PostmanRuntime/7.29.2' },
      timeout: 15000,
    });

    if (response.status === 200 && response.data.success) {
      res.status(200).json({ success: true, message: 'Data fetched successfully', data: response.data.result });
    } else {
      res.status(400).json({ success: false, message: response.data.exception || 'Failed to fetch data' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
