const express = require('express');
const router = express.Router();
const cors = require('cors'); // Import cors
const axios = require('axios');
const User = require('../models/User');
// Import authenticate middleware

// Apply CORS to this route
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
    // Step 1: Extract deviceSN from the request query
    const { deviceSN } = req.query;

    // Log incoming request details
    console.log('Received request for real-time data with deviceSN:', deviceSN);

    // Step 2: Validate if deviceSN is provided
    if (!deviceSN) {
      console.error('Device SN is missing in the request');
      return res.status(400).json({ success: false, message: 'Device SN is required' });
    }

    // Step 3: Authenticate user and fetch user data
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('Authenticated user not found');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Step 4: Validate if device belongs to user
    const device = user.devices.find((d) => d.sn === deviceSN);
    if (!device) {
      console.error(`Device with SN ${deviceSN} not found for user ${req.user.id}`);
      return res.status(404).json({ success: false, message: 'Device not found for this user' });
    }

    const { tokenId, sn } = device; // Extract tokenId and serial number
    const url = `https://www.solaxcloud.com:9443/proxy/api/getRealtimeInfo.do?tokenId=${encodeURIComponent(tokenId)}&sn=${encodeURIComponent(sn)}`;
     // Encode tokenId and sn for safe URL usage

    // Log Solax API request details
    console.log('Requesting Solax API with URL:', url);

    // Step 5: Make GET request to Solax API
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'User-Agent': 'PostmanRuntime/7.29.2',
      },
      timeout: 15000, // Set timeout to 15 seconds // Set timeout to 15 seconds
    });

    // Step 6: Handle Solax API response
    if (response.status === 200 && response.data.success) {
      console.log('Solax API responded successfully:', response.data.result);
      return res.status(200).json({
        success: true,
        message: 'Real-time data fetched successfully',
        deviceSN: sn,
        data: response.data.result,
      });
    } else {
      console.error('Solax API returned an error:', response.data);
      return res.status(400).json({
        success: false,
        message: response.data.exception || 'Failed to fetch real-time data',
        details: response.data,
      });
    }
  } catch (error) {
    // Step 7: Handle unexpected errors and log details
    console.error('Error connecting to Solax API:', error.response?.data || error.message || error.stack);

    // Differentiate between Solax API errors and other errors
    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: 'Error occurred while connecting to Solax API',
        error: error.response.data || error.message,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Internal server error occurred',
        error: error.message,
      });
    }
  }
});

module.exports = router;
