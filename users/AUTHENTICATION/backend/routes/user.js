const express=require('express');
const { userRegisterValidate } = require('../utils/uservalidation');
const { registerUser } = require('../controllers/user');
const routes=express.Router();


routes.post('/register',userRegisterValidate,registerUser);

module.exports=routes;