const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');

const { forwardAuthenticated } = require('../config/auth');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.redirect('/dashboard')
});

// Login get page
router.get('/login', forwardAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/airnow-dashboard', 'index.html'));
});

// Login to dashboard
router.post('/login', (req, res, next) => {
  passport.authenticate('local',
    // {
    //   // Redirects
    //   successRedirect: '/user/dashboard',
    //   failureRedirect: '/user/login',
    // },

    function (err, user, info) {
      if (err) {
        return next(err);
      }

      if (!user) {
        res.status(401).send({ valid: 0, message: 'Invalid Username or Password' });
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect('/dashboard');
      })
    }
  )(req, res, next);
});

module.exports = router;
