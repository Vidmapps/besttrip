const express 	= require('express');

const router 		= express.Router();
const passport 	= require('passport');
const User 		= require('../models/user');


// Default Route
router.get('/', (req, res) => { // Search Input page
  res.render('landing');
});


//= ==============AUTH ROUTES======================

// show sign up form
/* router.get("/register", function(req, res){
   res.render("register");
}); */

// show register form
router.get('/register', (req, res) => {
  res.render('register', { page: 'register' });
});

router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  if (req.body.adminCode === '123123') {
    newUser.isAdmin = true;
  }
  eval(require('locus'));
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register', { error: err.message });
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', `Welcome ${user.username}`);
      res.redirect('/campgrounds');
    });
  });
});

/* router.post("/register", function(req, res){
	req.body.username
	req.body.password
	eval(require('locus'))
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
			console.log(err);
			return res.render("register", {error: err.message});
		}
        passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome " + user.username);
            res.redirect("/campgrounds");
        });
    });
}); */

//= ==============AUTH ROUTES======================

//= ===== Login Routes ========
/*
router.get("/login", function(req, res){
   res.render("login");
}); */

// show login form
router.get('/login', (req, res) => {
  res.render('login', { page: 'login' });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login',
}), () => {

});

//= ===== Login Routes ========

//= ===== Logout Route ========

router.get('/logout', (req, res) => {
   	req.logout();
  req.flash('success', 'Logged you out');
  res.redirect('/');
});


//= ===== Logout Route ========

module.exports = router;
