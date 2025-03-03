const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const usermodel = require('../models/usermodel');
const SECRET_KEY = "viceCity"



app.use(cookieParser());

async function userverify(req, res, next) {
    let token = req.cookies.token;
    if (!token) {
        return res.send("Access denied")
    }
    
    jwt.verify(token,SECRET_KEY,async(err,decoded)=>{
        if(err){
            return res.send("Invalid token");
        }

        const user=await usermodel.findById(decoded.userId);
        if(!user){
            return res.send("Some issue while fetching your details");
        }
        req.user={userId:decoded.userId,name:user.name};
        next();
    })
   
}

module.exports = userverify;