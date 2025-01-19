const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const authenticate = require('../authenticate/authenticate'); // Middleware for authentication

router.get('/realtime-data', authenticate, async (req, res) => {
  try {
    const { deviceSN } = req.query;

    // Step 1: Validate if the Device SN is provided
    if (!deviceSN) {
      console.error('Error: Device SN is missing in the request');
      return res.status(400).json({ 
        success: false, 
        message: 'Device SN is required in the query parameters.' 
      });
    }

    // Step 2: Fetch the authenticated user from the database
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error(`Error: User with ID ${req.user.id} not found.`);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found. Please ensure you are logged in.' 
      });
    }

    // Step 3: Check if the user has the device with the given serial number (SN)
    const device = user.devices.find((d) => d.sn === deviceSN);
    if (!device) {
      console.error(`Error: Device with SN ${deviceSN} not found for user ${req.user.id}.`);
      return res.status(404).json({ 
        success: false, 
        message: 'Device not found. Please check the provided device serial number.' 
      });
    }

    // Step 4: Extract tokenId and serial number (SN) for the API request
    const { tokenId, sn } = device;
    const url = `https://www.solaxcloud.com:9443/proxy/api/getRealtimeInfo.do?tokenId=${tokenId}&sn=${sn}`;

    console.log(`Making API request to: ${url}`);

    // Step 5: Make the GET request to SolaxCloud API
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json', // Set headers for the request
      },
    });

    // Step 6: Check response status and content
    if (response.status === 200 && response.data.success) {
      console.log(`Success: Real-time data fetched for device SN: ${sn}`);
      return res.status(200).json({
        success: true,
        message: 'Real-time data fetched successfully.',
        deviceSN: sn,
        data: response.data.result, // Return the data from the API response
      });
    } else {
      console.error(`API Error: ${response.data.exception || 'Unknown error'}`);
      return res.status(400).json({
        success: false,
        message: response.data.exception || 'Failed to fetch real-time data from the API.',
        details: response.data,
      });
    }
  } catch (error) {
    // Step 7: Handle unexpected errors and log for debugging
    console.error('Unexpected Error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while fetching real-time data.',
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
