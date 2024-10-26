const express = require('express');
const cors = require('cors');  // Import CORS
const routes = require('./routes/user');
require('dotenv').config();
require('./config/db');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Route configuration
app.use('/api/v1', routes);

// Start the server and listen on all network interfaces
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
