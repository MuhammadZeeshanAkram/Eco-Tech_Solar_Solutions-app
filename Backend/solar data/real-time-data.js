const express = require('express');
const router = express.Router();
const cors = require('cors');
const axios = require('axios');
const User = require('../models/User');

// Apply CORS to this route
router.use(cors());

// Route to fetch real-time data without requiring authentication
router.get('/realtime-data', async (req, res) => {
  try {
    const { deviceSN, tokenId } = req.query; // Pass tokenId in the request query

    // Validate query parameters
    if (!deviceSN || !tokenId) {
      return res.status(400).json({ success: false, message: 'Device SN and tokenId are required' });
    }

    // Fetch data from Solax API
    const url = `https://www.solaxcloud.com:9443/proxy/api/getRealtimeInfo.do?tokenId=${encodeURIComponent(
      tokenId
    )}&sn=${encodeURIComponent(deviceSN)}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PostmanRuntime/7.29.2',
      },
      timeout: 15000, // Set timeout to 15 seconds
    });

    // Handle Solax API response
    if (response.status === 200 && response.data.success) {
      res.status(200).json({
        success: true,
        message: 'Data fetched successfully',
        data: response.data.result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: response.data.exception || 'Failed to fetch data',
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

module.exports = router;
