import { Router } from "express";
const router = Router();


router.get("/", (req, res) => {
    res.render("homePage");
})

export default router;