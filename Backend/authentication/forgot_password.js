const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Define the user schema for the "solarusers" collection
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  sn: { type: String, required: true },
  tokenId: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.models.solarusers || mongoose.model('solarusers', userSchema, 'solarusers');

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate a password reset link
    const resetLink = `http://13.60.17.246:3000/api/auth/reset-password?email=${email}`;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Hi ${user.name},\n\nPlease use the following link to reset your password:\n\n${resetLink}\n\nIf you did not request a password reset, please ignore this email.\n\nThank you!`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Error handling forgot password:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Reset Password Route
router.get('/reset-password', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send('Invalid reset link. Email is missing.');
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('Invalid reset link. Email not found.');
    }

    // Render the reset password form and include the external script
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reset Password</title>
        </head>
        <body>
          <h1>Reset Password</h1>
          <form id="resetForm">
            <input type="hidden" id="email" value="${email}" />
            <label for="password">New Password:</label>
            <input type="password" id="password" required />
            <br><br>
            <label for="confirmPassword">Confirm Password:</label>
            <input type="password" id="confirmPassword" required />
            <br><br>
            <button type="button" id="resetButton">Reset Password</button>
          </form>
          <script src="/static/resetPassword.js"></script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error handling reset password link:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update Password Route
router.post('/update-password', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Validate required fields
  if (!email || !password || !confirmPassword) {
    return res.status(400).send('All fields are required.');
  }

  // Validate if passwords match
  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match.');
  }

  try {
    // Hash the new password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Update the user's password in the database
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    // If user not found
    if (!user) {
      return res.status(404).send('User not found.');
    }

    // Respond with success message
    res.send('Password updated successfully.');
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
