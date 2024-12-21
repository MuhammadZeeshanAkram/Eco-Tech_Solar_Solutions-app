const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
require('dotenv').config(); // Load environment variables

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
    user: process.env.EMAIL_USER, // Email from .env file
    pass: process.env.EMAIL_PASS, // App Password from .env file
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
    const resetLink = `http://192.168.18.164:5000/api/auth/reset-password?email=${email}`;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: email, // Receiver's email address
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

    // Render the reset password form with JavaScript handling
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
          <script>
            document.getElementById('resetButton').addEventListener('click', async () => {
              const email = document.getElementById('email').value;
              const password = document.getElementById('password').value;
              const confirmPassword = document.getElementById('confirmPassword').value;

              if (!password || !confirmPassword) {
                alert('All fields are required.');
                return;
              }

              if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
              }

              try {
                const response = await fetch('http://192.168.18.164:5000/api/auth/update-password', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email, password, confirmPassword }),
                });

                const result = await response.text();
                if (response.ok) {
                  alert(result);
                } else {
                  alert('Error: ' + result);
                }
              } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while resetting your password.');
              }
            });
          </script>
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
      { email }, // Find user by email
      { password: hashedPassword }, // Update with hashed password
      { new: true } // Return the updated user document
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
