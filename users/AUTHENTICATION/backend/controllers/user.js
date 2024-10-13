const User = require("../models/user");
const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const nodemailer = require('nodemailer');

const registerUser = async (req, res) => {
    const userModel = new User(req.body);
    userModel.password = await bcrypt.hash(req.body.password, 10);
    try {
        const response = await userModel.save();
        response.password = undefined;
        return res.status(201).json({ message: "Registered successfully", data: response });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}
const getUsers= async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        return res.status(200).json({ data: users });
    } catch (err) {
        return res.status(500).json({ message: "error", error: err });
    }
}

const loginUser = async (req, res) => {
    try {
        let user;
        if (req.body.email) {
            user = await User.findOne({ email: req.body.email });
        } else if (req.body.name) {
            user = await User.findOne({ name: req.body.name });
        }else if (req.body.mobile) {
            user = await User.findOne({ mobile: req.body.mobile });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        user.password = undefined;
        return res.status(200).json({ message: "Logged in successfully", data: user });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const email=req.body.email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const randomString=randomstring.generate(6);
        const data=await user.updateOne({email:email},{$set:{token:randomString}});
        resetPassword(user.name,email,randomString);
        return res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}

const sendResetPasswordMail = async (name,email,token) => {
    try {
        const transporter=nodemailer.createTransport({
            host : 'smtp.gmail.com',
            port : 465,
            secure : false,
            requireTLS : true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const sendMail = ({
            from: process.env.EMAIL,
            to: email,
            subject: 'Password reset',
            text: `Hi ${name}, \n\nThe password reset link is: ${token}`
        })
        transporter.sendMail(sendMail,fucntion(err,info){
            if(err){
                console.log(err);
                return res.status(500).json({ message: "Internal server error", error: err });
            }
            else{
                return res.status(200).json({ message: "Password reset link sent to your email",info.response });
            }
            
        });
        
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
} 

module.exports = {
    registerUser,getUsers,loginUser,forgotPassword,sendResetPasswordMail,resetPassword
};