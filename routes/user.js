const express = require('express');
const router = express.Router();
const path = require('path');

const bcrypt = require('bcryptjs');
const passport = require('passport');

//Login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/air-now-login', 'index.html'));
});

module.exports = router;