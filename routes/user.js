const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');

const { forwardAuthenticated } = require('../config/auth');

const statistic = require('../controllers/statistic');

router.get('/', (req, res) => {
  // res.redirect('/login');
  res.sendFile(path.join(__dirname, '..', 'public/airnow-dashboard', 'index.html'));
});

router.get('/dashboard', (req, res) => {
  statistic.visit();
  res.sendFile(path.join(__dirname, '..', 'public/airnow-dashboard', 'index.html'));
});

router.get('/dashboard/home', (req, res) => {
  statistic.visit();
  res.sendFile(path.join(__dirname, '..', 'public/airnow-dashboard', 'index.html'));
});

router.get('/dashboard/user', (req, res) => {
  statistic.visit();
  res.sendFile(path.join(__dirname, '..', 'public/airnow-dashboard', 'index.html'));
});

router.get('/dashboard/device', (req, res) => {
  statistic.visit();
  res.sendFile(path.join(__dirname, '..', 'public/airnow-dashboard', 'index.html'));
});

// Login get page
router.get('/login', forwardAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/airnow-dashboard', 'index.html'));
});

// Login to dashboard
router.post('/login', (req, res, next) => {
  passport.authenticate('local',
    function (err, user, info) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ valid: 0, message: 'Invalid Username or Password' });
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.status(200).json({
          valid: 1,
          message: 'Login success',
          username: user.username,
          name: user.name,
          email: user.email
        });
      })
    }
  )(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  res.status(200).json({
    logout: 1,
    message: 'Logout out'
  });
  req.logOut();
});

module.exports = router;
