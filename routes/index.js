var express = require('express');
var router = express.Router();
var passport = require('passport');


// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}


/* GET home page. */
router.get('/',isAuthenticated, function(req, res) {
  var user = req.user;
  var pageData = { 
    title: 'YouTube',
    DisplayName : user.displayName(),
    ProfileImage : user.profileImage()
  };

  io.sockets.emit("join",pageData);
  res.render('index',pageData);
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/',
    failureRedirect : '/login'
}));

/* GET login page. */
router.get('/login', function(req, res) {
  // Display the Login page with any flash message, if any
  res.render('login', { message: req.flash('message') });
});

/* Handle Login POST */
router.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash : true 
}));

/* GET Registration Page */
router.get('/signup', function(req, res){
  res.render('signup',{message: req.flash('message')});
});

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash : true 
}));

/* Handle Logout */
router.get('/signout', function(req, res) {
  req.logout();
  res.redirect('/');
});

var io;
function out(i){
  io=i;
  return router;
}

module.exports = out;


