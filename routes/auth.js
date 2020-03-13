
const express = require('express');

const router 		    = express.Router();
const passport 	= require('passport');
const User 		  = require('../models/user');


//= ==============AUTH ROUTES======================

// show register form
router.get('/register', (_req, res) => {
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
  
  //= ==============AUTH ROUTES======================
  
  //= ===== Login Routes ========
  
  // show login form
  router.get('/login', (_req, res) => {
    res.render('login', { page: 'login' });
  });
  
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }));
  
  //= ===== Logout Route ========
  
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out');
    res.redirect('/');
  });

  module.exports = router;
