const express = require("express");
const app = express();
const port = 8001;
const cookieParser = require("cookie-parser")
const path = require("path");
const homepage = require("./routes/homepagerout")
const signpage = require("./routes/signinroute");
const singup = require("./routes/signuproute");
const usermodel = require("./models/usermodel");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userkapage = require("./routes/homepageafterloginroute")
const userlistblogs = require("./routes/userkeblogroute");
const SECRET_KEY = "viceCity"
const verificationOfUser=require("./middlewares/tokenverifymiddleware");
const userverify = require("./middlewares/tokenverifymiddleware");
const blogmodel=require("./models/blogmodel")

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set(express.static(path.join(__dirname,"public")))
app.set("view engine", "ejs");


app.use("/", homepage)
app.use("/", signpage)
app.use("/", singup)
app.use("/", userkapage)
app.use("/", userlistblogs)



app.post("/signup", async (req, res) => {
    let { name, email, password } = req.body;

    let alreadyAnUser = await usermodel.findOne({ email });

    if (alreadyAnUser) {
        return res.redirect("/Signin")
    }
    if (!name || !email || !password) {
        return res.send("Invalid user")
    }

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
            let newUser = await usermodel.create({
                name,
                email,
                password: hash,
            })
            res.redirect("/signin")
        });
    });

})


app.post("/signin", async (req, res) => {

    let { email, password } = req.body;
    if (!email || !password) {
        return res.send("Invalid Details")
    }
    let isUser = await usermodel.findOne({
        email,
    })
    if (!isUser) {
        return res.send("something wrong");
    }

    bcrypt.compare(password, isUser.password, async function (err, result) {
        if (result) {
            let token = jwt.sign(
                {
                    userId: isUser._id, email: isUser.email
                },
                SECRET_KEY,
                {
                    expiresIn: "1h"
                }

            );
            res.cookie("token", token);
            res.redirect(`/user/${isUser._id}`);
        } else {
            res.send("invalid details")
        }
    });
})


app.post("/users/:id", userverify, async (req, res) => {
    let { title, content ,author ,blogs } = req.body;
    let userId = req.user.userId;

    try {
        let blogCreated = await blogmodel.create({
            title,
            content,
            author:userId
        });
         
        await usermodel.findByIdAndUpdate(
            userId, 
            { $push: { blogs: blogCreated._id } }, // Push the blog ID to the array
            { new: true } // Ensure it returns the updated user
        );

        res.redirect(`/users/${userId}`); // Redirect to show blogs after submission
    } catch (error) {
        res.status(500).send("Error creating blog");
    }
});



app.get("/logout",(req,res)=>{
    res.clearCookie("token");
    res.redirect("/signin")
})

// app.post("/edit/:id",userverify,(req,res)=>{

    
// })

app.listen(port, () => {
    console.log("Server start at port 8001");
})