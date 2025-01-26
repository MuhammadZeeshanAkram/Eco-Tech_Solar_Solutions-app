const express = require('express');
const router = express.Router();
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config(); // Load .env variables
const JWT_SECRET = process.env.JWT_SECRET; // Load JWT_SECRET

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
    const url = `https://www.solaxcloud.com:9443/proxy/api/getRealtimeInfo.do?tokenId=${encodeURIComponent(
      tokenId
    )}&sn=${encodeURIComponent(sn)}`;

    const response = await axios.get(url, {
      headers: { 'Content-Type': 'application/json', Accept: '*/*' },
      timeout: 15000,
    });

    if (response.status === 200 && response.data.success) {
      return res.status(200).json({
        success: true,
        message: 'Real-time data fetched successfully',
        deviceSN: sn,
        data: response.data.result,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: response.data.exception || 'Failed to fetch real-time data',
        details: response.data,
      });
    }
  } catch (error) {
    console.error('Error connecting to Solax API:', error.response?.data || error.message || error.stack);
    res.status(500).json({ success: false, message: 'Internal server error occurred', error: error.message });
  }
});

module.exports = router;
