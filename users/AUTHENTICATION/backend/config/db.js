const mongoose = require("mongoose");
const url=process.env.MONGO_URL;

mongoose.connect(url)
.then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log("unable to connect",err);
})