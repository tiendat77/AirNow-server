const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');

const { forwardAuthenticated } = require('../config/auth');
const { ensureAuthenticated } = require('../config/auth');

router.get('*', ensureAuthenticated, (req, res) => {
  console.log('dasboard');
  statistic.visit();
  res.sendFile(path.join(__dirname, '..', 'public/airnow-dashboard', 'index.html'));
});

module.exports = router;