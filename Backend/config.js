const crypto = require('crypto');

// Generate a random 32-byte secret key
const JWT_SECRET = crypto.randomBytes(32).toString('hex');

module.exports = { JWT_SECRET };
