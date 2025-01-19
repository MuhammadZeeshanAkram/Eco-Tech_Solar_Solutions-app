const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const authenticate = require('../authenticate/authenticate'); // Import authenticate middleware

// API to fetch real-time data for a device
router.get('/realtime-data', authenticate, async (req, res) => {
  try {
    const { deviceSN } = req.query; // Device SN passed as query parameter

    if (!deviceSN) {
      return res.status(400).json({ message: 'Device SN is required' });
    }

    // Fetch user from MongoDB
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the device by SN
    const device = user.devices.find((d) => d.sn === deviceSN);
    if (!device) {
      return res.status(404).json({ message: 'Device not found for this user' });
    }

    const { tokenId, sn } = device;
    const url = `https://www.solaxcloud.com:9443/proxy/api/getRealtimeInfo.do?tokenId=${tokenId}&sn=${sn}`;
    

    // Call Solax Cloud API
    const response = await axios.get(url);

    if (response.status === 200 && response.data.success) {
      return res.status(200).json({
        success: true,
        deviceSN: sn,
        data: response.data.result,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch real-time data',
        details: response.data,
      });
    }
  } catch (error) {
    console.error('Error fetching real-time data:', error);
    res.status(500).json({ message: 'Failed to fetch real-time data' });
  }
});

module.exports = router;
