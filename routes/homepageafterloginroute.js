import { Router } from "express";
const router = Router();
import { userverify } from "../middlewares/tokenverifymiddleware.js";

router.get("/user/:id", userverify, (req, res) => {
    const { id } = req.params;

    if (id !== req.user.userId) {
        return res.status(403).send("Access Denied");
    }

    res.render("homePageAfterLogin", { userId: id, name: req.user.name });

})

export default router;