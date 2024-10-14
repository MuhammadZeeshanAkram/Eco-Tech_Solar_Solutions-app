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


const loginUser = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;
        const { rememberMe } = req.body;

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
            // Add other non-sensitive fields as needed
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

module.exports = {
    registerUser,
    getUsers,
    loginUser,
    
    
};
