import { Router } from "express";
const router = Router();
import { userverify } from "../middlewares/tokenverifymiddleware.js"
import { BlogModel } from "../models/blogmodel.js"

router.get("/users/:id", userverify, async (req, res) => {
    const { id } = req.params;

    if (id !== req.user.userId) {
        return res.status(403).send("Access Denied");
    }

    try {
        const blogs = await BlogModel
            .find({ author: id })
            .populate("author")
            .sort({ createdAt: -1 });;

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

router.get("/delete/:blogId", userverify, async (req, res) => {
    const { blogId } = req.params;
    try {
        // Find the blog and check authorization
        const blog = await BlogModel.findById(blogId);
        if (!blog) return res.status(404).send("Blog not found");

        // Delete the blog
        await BlogModel.findByIdAndDelete(blogId)

        res.redirect(`/users/${req.user.userId}`); // Redirect to the blog list after deletion
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting blog");
    }
});

router.get("/edit/:blogId", userverify, async (req, res) => {
    const { blogId } = req.params;
    try {
        // Find the blog and check authorization
        const blog = await BlogModel.findById(blogId);
        if (!blog) return res.status(404).send("Blog not found");


        res.render("editpage", { blog })
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting blog");
    }
})

router.post("/edit/:userId/:blogId", userverify, async (req, res) => {
    const { blogId, userId } = req.params;
    const { title, content } = req.body;
    if ([title, content].some((field) => (typeof field !== "string" || field.trim() === ""))) {
        return res.send("Invalid new data.")
    }
    await BlogModel.findByIdAndUpdate(blogId, {
        title,
        content,
    })
    res.redirect(`/users/${userId}`)

});

export default router;
