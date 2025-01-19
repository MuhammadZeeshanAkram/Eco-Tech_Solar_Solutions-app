const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const authenticate = require('../authenticate/authenticate'); // Import authenticate middleware





router.get('/realtime-data', authenticate, async (req, res) => {
  try {
    const { deviceSN } = req.query;

    // Validate if the Device SN is provided
    if (!deviceSN) {
      return res.status(400).json({ success: false, message: 'Device SN is required' });
    }

    // Find the authenticated user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the device belonging to the user
    const device = user.devices.find((d) => d.sn === deviceSN);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found for this user' });
    }

    const { tokenId, sn } = device; // Extract tokenId and serial number (SN)
    const url = `https://www.solaxcloud.com:9443/proxy/api/getRealtimeInfo.do?tokenId=${tokenId}&sn=${sn}`;

    // Make the GET request to SolaxCloud API
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle successful response
    if (response.status === 200 && response.data.success) {
      return res.status(200).json({
        success: true,
        message: 'Real-time data fetched successfully',
        deviceSN: sn,
        data: response.data.result, // Ensure the correct nested property is returned
      });
    } else {
      // Handle API-level errors
      return res.status(400).json({
        success: false,
        message: response.data.exception || 'Failed to fetch real-time data',
        details: response.data,
      });
    }
  } catch (error) {
    // Log and handle unexpected errors
    console.error('Error fetching real-time data:', error.response?.data || error.stack || error.message);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching real-time data',
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
