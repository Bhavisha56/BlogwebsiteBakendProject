import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures email is unique for each user
    },
    password: {
        type: String,
        required: true,
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userkablog"
    }]
}, {
    timestamps: true
})

export const UserModel = mongoose.model("user", userSchema);
