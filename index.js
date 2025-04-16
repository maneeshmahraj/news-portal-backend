const express = require("express");
const app=express();


 const userSignUpRoutes = require('./routes/userSignUpRoutes')
 const userSignInRoutes = require('./routes/userSignInRoutes')

const cors = require('cors')
const bodyparser = require('body-parser')
require('dotenv').config();
require("./config/dbconnection")
const port=process.env.PORT || 6000;



app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.json())

 app.use('/api/user', userSignUpRoutes);
 app.use('/api/user', userSignInRoutes);



app.listen(port, ()=>{
    console.log("app run on:  "+port)
})
