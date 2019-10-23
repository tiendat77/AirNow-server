const express = require('express');
const router = express.Router();
const path = require('path');

const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

//Login page
//router.get('/login', (req, res) => {
//  res.sendFile(path.join(__dirname, '..', 'public/air-now-login', 'index.html'));
//});
router.get('/login', forwardAuthenticated, (req, res) => {
 res.sendFile(path.join(__dirname, '..', 'public/air-now-login', 'index.html'));
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;
