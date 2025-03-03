const express = require("express");
const Router = express.Router();
const userverify = require("../middlewares/tokenverifymiddleware");
const blogmodel = require("../models/blogmodel");

Router.get("/users/:id", userverify, async (req, res) => {
    const { id } = req.params;

    if (id !== req.user.userId) {
        return res.status(403).send("Access Denied");
    }

    try {
        const blogs = await blogmodel.find({ author: id }).populate("author");

        res.render("userlistofblogs", {
            userId: id,
            content: req.user.content,
            name: req.user.name,
            blogs
        });
    } catch (error) {
        res.status(500).send("Error fetching blogs");
    }
});

Router.get("/delete/:blogId", userverify, async (req, res) => {
    const { blogId } = req.params;
    try {
        // Find the blog and check authorization
        const blog = await blogmodel.findById(blogId);
        if (!blog) return res.status(404).send("Blog not found");

        // Delete the blog
        await blogmodel.findByIdAndDelete(blogId)

        res.redirect(`/users/${req.user.userId}`); // Redirect to the blog list after deletion
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting blog");
    }
});

Router.get("/edit/:blogId", userverify, async (req, res) => {
    const { blogId } = req.params;
    try {
        // Find the blog and check authorization
        const blog = await blogmodel.findById(blogId);
        if (!blog) return res.status(404).send("Blog not found");


        res.render("editpage", { blog })
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting blog");
    }
})

Router.post("/edit/:userId/:blogId", userverify, async (req, res) => {
    const { blogId, userId } = req.params;
    const { title, content } = req.body
    await blogmodel.findByIdAndUpdate(blogId, {
        title,
        content,
    })
    res.redirect(`/users/${userId}`)

});

module.exports = Router;
