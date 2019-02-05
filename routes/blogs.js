var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");
var middleware = require("../middleware");


// BLOG INDEX --- SHOW ALL BLOGS
router.get("/", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else{
            res.render("blogs/index", {blogs: blogs});
        }
    });
});

// NEW BLOG
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("blogs/new");
});

// CREATE NEW BLOG
router.post("/", middleware.isLoggedIn, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var body = req.body.blog.body;
    var title = req.body.title;
    var image = req.body.image;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newBlog = {title:title, image:image, body:body, author:author};
    console.log(req.user);
    Blog.create(newBlog, function(err, newlyCreated){
        if(err){
            console.log(err);
            res.render("blogs/new");
        } else{
            //then redirect to the index
            console.log(newlyCreated);
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE - shows only 1 blog
router.get("/:id", function(req, res){
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            console.log(err);
        } else{
            console.log(foundBlog);
            res.render("blogs/show", {blog: foundBlog});
        }
    });
});


// EDIT ROUTE
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkBlogOwnership, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        res.render("blogs/edit", {blog: foundBlog});
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.isLoggedIn, middleware.checkBlogOwnership, function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE BLOG ROUTE
router.delete("/:id", middleware.checkBlogOwnership, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
        console.log(err);
    } else{
        res.redirect("/blogs");
    }
   }); 
});




module.exports = router;
