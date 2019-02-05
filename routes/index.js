var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");



// BLOG LANDING
router.get("/", function(req ,res){
   res.render("landing"); 
});



// AUTH ROUTES
//=======================================================================
//SIGN UP FORM
router.get("/register", function(req, res){
    res.render("register");
});
// HANDLE SIGN UP LOGIC
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to CodeBlog " + user.username);
            res.redirect("/blogs");
        })
    });
});

// LOGIN FORM
router.get("/login", function(req, res){
    res.render("login");
});

// LOGIN LOGIC
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/blogs", 
        failureRedirect: "/login"
        
    }), function(req, res){
        
});


// LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "LOGGED YOU OUT");
    res.redirect("/blogs");
});


module.exports = router;