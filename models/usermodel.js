const mongoose=require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/Blogusers");

const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
       type:String,
        required:true,
        unique: true // Ensures email is unique for each user
    },
    password:{
        type:String,
        required:true,
    },
    blogs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userkablog"
    }]
})

module.exports=mongoose.model("user",userSchema);
