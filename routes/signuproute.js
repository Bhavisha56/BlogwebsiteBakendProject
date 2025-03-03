const express=require("express");
const Router=express.Router();



Router.get("/Signup",(req,res)=>{
    res.render("signupPage");
})

module.exports=Router;