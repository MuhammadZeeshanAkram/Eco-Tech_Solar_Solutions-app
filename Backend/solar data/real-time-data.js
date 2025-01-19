const express = require('express');
const router = express.Router();
const cors = require('cors'); // Import cors
const axios = require('axios');
const User = require('../models/User');
const authenticate = require('../authenticate/authenticate'); // Import authenticate middleware

// Apply CORS to this route
router.use(cors());

router.get('/realtime-data', authenticate, async (req, res) => {
  console.log('Incoming request to /realtime-data endpoint');
  try {
    const { deviceSN } = req.query;

    console.log(`Received deviceSN from query: ${deviceSN}`);
    // Validate if the Device SN is provided
    if (!deviceSN) {
      console.log('Device SN is missing in the query parameters');
      return res.status(400).json({ success: false, message: 'Device SN is required' });
    }

    // Find the authenticated user
    console.log(`Looking up user with ID: ${req.user.id}`);
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found in the database');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the device belonging to the user
    console.log(`Searching for device with SN: ${deviceSN} in user's device list`);
    const device = user.devices.find((d) => d.sn === deviceSN);
    if (!device) {
      console.log('Device not found for this user');
      return res.status(404).json({ success: false, message: 'Device not found for this user' });
    }

    const { tokenId, sn } = device; // Extract tokenId and serial number (SN)
    console.log(`Found device: SN=${sn}, Token ID=${tokenId}`);

    const url = `https://www.solaxcloud.com:9443/proxy/api/getRealtimeInfo.do?tokenId=${tokenId}&sn=${sn}`;
    console.log(`Requesting real-time data from SolaxCloud API: ${url}`);

    // Make the GET request to SolaxCloud API
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle successful response
    if (response.status === 200 && response.data.success) {
      console.log('Successfully fetched real-time data:', response.data.result);
      return res.status(200).json({
        success: true,
        message: 'Real-time data fetched successfully',
        deviceSN: sn,
        data: response.data.result, // Ensure the correct nested property is returned
      });
    } else {
      // Handle API-level errors
      console.error('Error from SolaxCloud API:', response.data);
      return res.status(400).json({
        success: false,
        message: response.data.exception || 'Failed to fetch real-time data',
        details: response.data,
      });
    }
  } catch (error) {
    // Log and handle unexpected errors
    console.error('Unexpected error occurred:', error.response?.data || error.stack || error.message);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching real-time data',
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
