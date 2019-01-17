var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/user");

var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
  res.render('index', { user : req.user });
};

// Go to registration page
userController.register = function(req, res) {
  res.render('register');
};

// Post registration
userController.doRegister = function(req, res) {
  var consumer ="consumer"
  var producer = "producer"
  if(req.body.codigo === "prof123456"){

    User.register(new User({ name: req.body.name, username:req.body.username , email: req.body.email, role:producer}), req.body.password, function(err, user) {
    if (err) {
      console.log(err)
      return res.render('register', { user : user });
    }
      res.redirect('/');

  });
}else{ if(req.body.codigo === "aluno2345"){
  User.register(new User({ name: req.body.name,username:req.body.username ,email: req.body.email,role:aluno}), req.body.password, function(err, user) {
  if (err) {
    console.log(err)
    return res.render('register', { user : user });
  }
    res.redirect('/');
  });
}
}
};

// Go to login page
userController.login = function(req, res) {
  res.render('login');
};

// Post login
userController.doLogin = function(req, res) {
  passport.authenticate('local')(req, res, function () {
    res.redirect('/profile');
  });
};

// logout
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = userController;