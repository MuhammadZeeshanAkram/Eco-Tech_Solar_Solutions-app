const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{ 
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{10,15}$/  // Assuming the mobile number has 10-15 digits
    },
    date:{
        type:Date,
        default:Date.now
    },
    token:{
        type:String,
        
    }



},{timestamps:true});


const User=mongoose.model('solarUsers',userSchema);
module.exports=User;