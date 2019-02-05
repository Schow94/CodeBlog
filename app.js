var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    Blog             = require("./models/blog"),
    Comment       = require("./models/comment"),
    User          = require("./models/user");

// REQUIRING ROUTES
var commentRoutes = require("./routes/comments"),
    blogRoutes = require("./routes/blogs"),
    indexRoutes = require("./routes/index");

    
mongoose.connect("mongodb://localhost:27017/new_blog_v2", {useNewUrlParser:true});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});



//ABOUT ROUTE
app.get("/about", function(req, res){
    res.render("about");
});

app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);
app.use("/", indexRoutes);




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING!");
});