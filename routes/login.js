const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');

const { forwardAuthenticated } = require('../config/auth');
const { ensureAuthenticated } = require('../config/auth');

// Login get page
router.get('/', forwardAuthenticated, (req, res) => {
  console.log('..login')
  res.sendFile(path.join(__dirname, '..', 'public/airnow-dashboard', 'index.html'));
});

// Login to dashboard
router.post('/', (req, res, next) => {
  console.log('..login ps')
  passport.authenticate('local',
    function (err, user, info) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ valid: 0, message: 'Invalid Username or Password' });
      }

      req.login(user, function (err) {
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

module.exports = router;