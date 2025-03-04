import { Router } from "express";
const router = Router();


router.get("/Signup", (req, res) => {
    res.render("signupPage");
})

export default router;