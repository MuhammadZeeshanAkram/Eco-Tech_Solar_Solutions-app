const express=require('express');
const routes = require('./routes/user');

const app=express();
require('dotenv').config();
require('./config/db');
const port=process.env.PORT || 3000;

app.use('/api/v1',routes);

app.listen(port,()=>{
    console.log(`server running on port ${port}`);
})
