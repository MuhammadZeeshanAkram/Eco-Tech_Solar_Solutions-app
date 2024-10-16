const express = require('express');
const { userRegisterValidate, userLoginValidateWithName, userLoginValidateWithEmail, userLoginValidationWithMobile } = require('../utils/uservalidation');
const { registerUser, getUsers, loginUser, logoutUser, forgotResetPassword } = require('../controllers/user');

const routes = express.Router();

// Get users (without password)
routes.get('/users', getUsers);

// Register a new user
routes.post('/register', userRegisterValidate, registerUser);

// Login routes
routes.post('/login-with-name', userLoginValidateWithName, loginUser);
routes.post('/login-with-email', userLoginValidateWithEmail, loginUser);
routes.post('/login-with-mobile', userLoginValidationWithMobile, loginUser);
routes.post('/forgot-password', forgotResetPassword);

routes.post('/logout', logoutUser);


module.exports = routes;
