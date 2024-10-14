const express = require('express');
const { userRegisterValidate, userLoginValidateWithName, userLoginValidateWithEmail, userLoginValidationWithMobile } = require('../utils/uservalidation');
const { registerUser, getUsers, loginUser, resetPassword, forgotPassword } = require('../controllers/user');

const routes = express.Router();

// Get users (without password)
routes.get('/users', getUsers);

// Register a new user
routes.post('/register', userRegisterValidate, registerUser);

// Login routes
routes.post('/login-with-name', userLoginValidateWithName, loginUser);
routes.post('/login-with-email', userLoginValidateWithEmail, loginUser);
routes.post('/login-with-mobile', userLoginValidationWithMobile, loginUser);

// Forgot password - only generate and send reset token
routes.post('/forgot-password', forgotPassword);

// Reset password - separate route after the token is received
routes.post('/reset-password', resetPassword);

module.exports = routes;
