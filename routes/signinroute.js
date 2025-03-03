const express=require("express");
const Router=express.Router();


Router.get("/signin",(req,res)=>{
    res.render("signinPage");
})

module.exports=Router;