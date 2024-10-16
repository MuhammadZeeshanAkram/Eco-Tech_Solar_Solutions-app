const User = require("../models/user");
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Register user
const registerUser = async (req, res) => {
    const userModel = new User(req.body);
    userModel.password = await bcrypt.hash(req.body.password, 10); // Hash password
    try {
        const response = await userModel.save();
        response.password = undefined; // Remove password from response
        return res.status(201).json({ message: "Registered successfully", data: response });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}

// Get all users without password field
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        return res.status(200).json({ data: users });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}

// Login user with Remember Me functionality
const loginUser = async (req, res) => {
    try {
        const { name, email, mobile, password, rememberMe } = req.body;

        let user;

        // Find user based on the provided credential
        if (name) {
            user = await User.findOne({ name });
        } else if (email) {
            user = await User.findOne({ email });
        } else if (mobile) {
            user = await User.findOne({ mobile });
        }

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT tokens
        const tokenObject = {
            _id: user._id,
            email: user.email,
            name: user.name,
        };

        // Short-lived access token (e.g., 15 minutes)
        const accessToken = jwt.sign(tokenObject, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Long-lived refresh token (7 days or 30 days if "Remember Me" is checked)
        const refreshToken = jwt.sign(tokenObject, process.env.REFRESH_SECRET, { expiresIn: rememberMe ? '30d' : '7d' });

        // Store the refresh token in a secure, HttpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
        });

        // Remove sensitive data from the user object before sending the response
        const userResponse = {
            _id: user._id,
            email: user.email,
            name: user.name,
            mobile: user.mobile,
        };

        // Return response with access token and user data
        return res.status(200).json({
            message: "Logged in successfully",
            accessToken,
            user: userResponse
        });

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: "An error occurred during login. Please try again." });
    }
};

// Forgot and Reset Password (merged function)
const forgotResetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!newPassword) {
            // If no new password provided, it means user is requesting a reset token
            const resetToken = crypto.randomBytes(20).toString('hex');
            const resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry

            // Update user with reset token and expiry
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpiry = resetTokenExpiry;
            await user.save();

            // Send reset password email
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });

            const mailOptions = {
                to: user.email,
                from: process.env.EMAIL,
                subject: 'Password Reset Request',
                text: `You are receiving this because you (or someone else) have requested to reset your password for your account.\n\n` +
                    `Please click the following link to reset your password:\n\n` +
                    `${req.headers.origin}/reset-password/${resetToken}\n\n` +
                    `If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };

            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: "Password reset email sent successfully." });

        } else {
            // If new password is provided, reset the user's password
            const { token } = req.params;

            const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpiry: { $gt: Date.now() } });
            if (!user) {
                return res.status(400).json({ message: "Invalid or expired token" });
            }

            user.password = await bcrypt.hash(newPassword, 10); // Hash new password
            user.resetPasswordToken = undefined;
            user.resetPasswordExpiry = undefined;

            await user.save();

            return res.status(200).json({ message: "Password reset successfully" });
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred", error: err });
    }
};

// Logout user
const logoutUser = (req, res) => {
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
    registerUser,
    getUsers,
    loginUser,
    forgotResetPassword,
    logoutUser,
};
