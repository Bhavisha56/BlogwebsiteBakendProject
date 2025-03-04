import { Router } from "express";
const router = Router();


router.get("/signin", (req, res) => {
    res.render("signinPage");
})

export default router;