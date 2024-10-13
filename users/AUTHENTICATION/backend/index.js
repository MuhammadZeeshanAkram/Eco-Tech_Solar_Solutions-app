const express=require('express');
const routes = require('./routes/user');

const app=express();
require('dotenv').config();
require('dotenv').controller();
require('./config/db');
app.use(express.json());
const port=process.env.PORT || 3000;

app.use('/api/v1',routes);

app.listen(port,()=>{
    console.log(`server running on port ${port}`);
})
