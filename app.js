import dotenv from "dotenv";
dotenv.config();

import { dataBaseConnection } from "./lib/databaseConnection.js";
import path from "path";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dataBaseConnection();

import express from "express";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SECRET_KEY = process.env.JWT_KEY;
const port = process.env.PORT;
const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set(express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs");

import homePageRouter from "./routes/homepagerout.js";
import signUpPageRouter from "./routes/signuproute.js";
import signUpRouter from "./routes/signinroute.js";
import userKaPagePageRouter from "./routes/homepageafterloginroute.js";
import blogPageRouter from "./routes/userkeblogroute.js";
import { UserModel } from "./models/usermodel.js";
import { userverify } from "./middlewares/tokenverifymiddleware.js";
import { BlogModel } from "./models/blogmodel.js";

app.use("/", homePageRouter)
app.use("/", signUpPageRouter)
app.use("/", signUpRouter)
app.use("/", userKaPagePageRouter)
app.use("/", blogPageRouter)



app.post("/signup", async (req, res) => {
    let { name, email, password } = req.body;

    let alreadyAnUser = await UserModel.findOne({ email });

    if (alreadyAnUser) {
        return res.redirect("/Signin")
    }

    if ([name, email, password].some((field) => (typeof field !== "string" || field.trim() === ""))) {
        return res.send("Invalid user")
    }

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
            await UserModel.create({
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
    if ([email, password].some((field) => (typeof field !== "string" || field.trim() === ""))) {
        return res.send("Invalid Details")
    }
    let isUser = await UserModel.findOne({
        email
    });
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
    let { title, content, } = req.body;
    let userId = req.user.userId;

    try {
        let blogCreated = await BlogModel.create({
            title,
            content,
            author: userId
        });

        await UserModel.findByIdAndUpdate(
            userId,
            { $push: { blogs: blogCreated._id } }, // Push the blog ID to the array
            { new: true } // Ensure it returns the updated user
        );

        res.redirect(`/users/${userId}`); // Redirect to show blogs after submission
    } catch (error) {
        res.status(500).send("Error creating blog");
    }
});



app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/signin")
})

// app.post("/edit/:id",userverify,(req,res)=>{


// })

app.listen(port, () => {
    console.log(`Server start at ${port} : http://localhost:${port}`);
})