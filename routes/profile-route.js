const router = require("express").Router(); 
const Post = require("../models/post-model");

const authCheck = (req, res, next) => {
    if(!req.isAuthenticated()) {
        res.redirect("/auth/login");
    } else {
        next();
    }
};

router.get("/", authCheck, async (req, res) => {
    let postFound = await Post.find({ author: req.user._id});
    res.render("profile", {user: req.user, posts: postFound});
});

router.get("/post", authCheck, (req, res) => {
    res.render("post", {user: req.user});
});

router.post("/post", authCheck, async (req, res) => {
    let {title, content} = req.body;
    let newPost = new Post({
        title,
        content,
        author: req.user._id
    });
    try {
        await newPost.save();
        res.status(200).redirect("/profile");
    } catch (err) {
        req.flash("error_msg", "*錯誤* 記得輸入標題和內容");
        res.redirect("/profile/post");
    }
});

module.exports = router;