const express = require("express");
const Router = express.Router();
const userverify = require("../middlewares/tokenverifymiddleware")

Router.get("/user/:id", userverify, (req, res) => {
    const { id } = req.params;

    if (id !== req.user.userId) {
        return res.status(403).send("Access Denied");
    }

    res.render("homePageAfterLogin", { userId: id, name: req.user.name });

})

module.exports = Router;