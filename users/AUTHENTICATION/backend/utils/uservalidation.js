
const Joi=require('joi');
const userRegisterValidate=(req,res,next)=>{
    const schema=Joi.object({
        name:Joi.string().min(3).max(100).required(),
        email:Joi.string().email().required(),
        mobile: Joi.string().pattern(/^[0-9]{10,15}$/),
        password:Joi.string().min(4).alphanum().required(),
        confirmPassword: Joi.any().equal(Joi.ref('password')).required()
            .messages({ 'any.only': 'Passwords do not match' })
    });
    const {error,value}=schema.validate(req.body);
    if(error){
        return res.status(400).json({message:"Bad Request",error});
    }
    next();

}
const userLoginValidateWithName=(req,res,next)=>{
    const schema=Joi.object({
        name:Joi.string().min(3).max(100).required(),
        password:Joi.string().min(4).alphanum().required(),
    });
    const {error,value}=schema.validate(req.body);
    if(error){
        return res.status(400).json({message:"Bad Request",error});
    }
    next();
}
const userLoginValidateWithEmail=(req,res,next)=>{
    const schema=Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(4).alphanum().required(),
    });
    const {error,value}=schema.validate(req.body);
    if(error){
        return res.status(400).json({message:"Bad Request",error});
    }
    next();
}

const userLoginValidationWithMobile=(req,res,next)=>{
    const schema=Joi.object({
        mobile:Joi.string().pattern(/^[0-9]{10,15}$/),
        password:Joi.string().min(4).alphanum().required(),
    });
    const {error,value}=schema.validate(req.body);
    if(error){
        return res.status(400).json({message:"Bad Request",error});
    }
    next();
}
module.exports={userRegisterValidate,userLoginValidateWithName,userLoginValidateWithEmail,userLoginValidationWithMobile};