const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to fetch real-time data from Solax Cloud API
app.get('/api/realtime-data', async (req, res) => {
  try {
    const tokenId = '202411162123206210779110';
    const sn = 'SN9XRUFD4K';
    const url = `https://www.solaxcloud.com:9443/proxy/api/getRealtimeInfo.do?tokenId=${tokenId}&sn=${sn}`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
});

app.listen(5000, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:5000`);
  });
  
