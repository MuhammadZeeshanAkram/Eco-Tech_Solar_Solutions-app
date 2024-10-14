const User = require("../models/user");
const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const nodemailer = require('nodemailer');
require('dotenv').config();

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

// Login user by email, name, or mobile
const loginUser = async (req, res) => {
    try {
        let user;
        if (req.body.email) {
            user = await User.findOne({ email: req.body.email });
        } else if (req.body.name) {
            user = await User.findOne({ name: req.body.name });
        } else if (req.body.mobile) {
            user = await User.findOne({ mobile: req.body.mobile });
        }

        // Check if user exists and password matches
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        user.password = undefined; // Remove password from response
        return res.status(200).json({ message: "Logged in successfully", data: user });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}


const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        console.log('Request received for email:', email);

        const user = await User.findOne({ email: email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({ message: "If this email is registered, you will receive a password reset link shortly." });
        }

        const randomString = randomstring.generate(20);
        user.token = randomString;
        await user.save();

        await sendResetPasswordMail(user.name, email, randomString);
        return res.status(200).json({ message: "Password reset link sent to your email." });
    } catch (err) {
        console.error('Error in forgotPassword:', err);
        return res.status(500).json({ message: "An error occurred while processing your request." });
    }
}

const sendResetPasswordMail = async (name, email, token) => {
    try {
        console.log('EMAIL:', process.env.EMAIL);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);

        console.log('Setting up transporter...');
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: '"IDS SOLAR APP" <' + process.env.EMAIL + '>',
            to: email,
            subject: 'Reset Your Password',
            html: `<p>Hello ${name},</p>
                   <p>Please use the following link to reset your password:</p>
                   <a href="http://localhost:3000/api/v1/forgot-password?token=${token}">Reset Password</a>
                   <p>This link will expire in 1 hour.</p>`
        };

        console.log('Sending email to:', email);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error in sending email:', error);
        throw new Error('Failed to send reset password email');
    }
};



// Reset password
const resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.token !== token) {
            return res.status(401).json({ message: "Invalid token" });
        }
        user.password = await bcrypt.hash(newPassword, 10); // Hash new password
        user.token = undefined; // Clear token after use
        const response = await user.save();
        return res.status(200).json({ message: "Password reset successfully", data: response });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}

module.exports = {
    registerUser,
    getUsers,
    loginUser,
    forgotPassword,
    sendResetPasswordMail,
    resetPassword
};
