import jwt from "jsonwebtoken";
import { UserModel } from "../models/usermodel.js";

export async function userverify(req, res, next) {

    if (!process.env.JWT_KEY) {
        process.exit(1);
    }

    const SECRET_KEY = process.env.JWT_KEY;

    let token = req.cookies.token;
    if (!token) {
        return res.send("Access denied")
    }

    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.send("Invalid token");
        }

        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return res.send("Some issue while fetching your details");
        }
        req.user = { userId: decoded.userId, name: user.name };
        next();
    })

}

