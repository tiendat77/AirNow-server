const express = require('express');
const router = express.Router();
const path = require('path');

const bcrypt = require('bcryptjs');
const passport = require('passport');


// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login get page
router.get('/login', forwardAuthenticated, (req, res) => {
//router.get('/login', (req, res) => {

  res.sendFile(path.join(__dirname, '..', 'public/air-now-login', 'index.html'));
});

// Login to dashboard

//router.post('/login', (req, res) => {

//  const userList = require('../data-test/USER');  //Just for test - Import mock data
//  var username = req.body.username;
//  var password = req.body.password;
// const user = userList.find(user => user.username === username);
//  if (!user) {
//    res.status(200).send({ valid: 0, message: "Invalid Username" });
//  } else if (user.password != password) {
//    res.status(200).send({ valid: 0, message: "Wrong password" });
//  } else {
//    res.redirect('/user/dashboard');
//  }
//});

//router.get('/dashboard', (req, res) => {
//  res.status(200).send('Login success');
//});

// Login to dashboard
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;
