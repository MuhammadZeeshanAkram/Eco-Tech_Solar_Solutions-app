const express=require('express');
const { userRegisterValidate, userLoginValidateWithName, userLoginValidateWithEmail, userLoginValidationWithMobile } = require('../utils/uservalidation');
const { registerUser, getUsers, loginUser } = require('../controllers/user');


const routes=express.Router();

routes.get('/users', getUsers);
routes.post('/register',userRegisterValidate,registerUser);
routes.post('/login-with-name', userLoginValidateWithName, loginUser);
routes.post('/login-with-email', userLoginValidateWithEmail, loginUser);
routes.post('/login-with-mobile', userLoginValidationWithMobile, loginUser);


module.exports=routes;