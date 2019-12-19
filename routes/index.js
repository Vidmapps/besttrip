var express 	= require("express");
var router 		= express.Router();
var passport 	= require("passport");
var User 		= require("../models/user");



//Default Route
router.get("/", function(req, res){ //Search Input page
	res.render("landing");
});


//===============AUTH ROUTES======================

//show sign up form
router.get("/register", function(req, res){
   res.render("register"); 
});

router.post("/register", function(req, res){
	req.body.username
	req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
			req.flash("error", err.message);	
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome " + user.username);	
            res.redirect("/campgrounds");
        });
    });
});

//===============AUTH ROUTES======================

//====== Login Routes ========

router.get("/login", function(req, res){
   res.render("login"); 
});

router.post("/login", passport.authenticate("local", {
	successRedirect : "/campgrounds",
	failureRedirect : "/login"
}), function(req, res){
	
});

//====== Login Routes ========

//====== Logout Route ========

router.get("/logout", function(req, res){
   	req.logout();
	req.flash("success", "Logged you out");
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

//====== Logout Route ========

	module.exports = router;