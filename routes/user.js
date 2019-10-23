const express = require('express');
const router = express.Router();
const path = require('path');

const bcrypt = require('bcryptjs');
const passport = require('passport');

// Login get page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/air-now-login', 'index.html'));
});

// Login to dashboard
router.post('/login', (req, res) => {

  const userList = require('../data-test/USER');  //Just for test - Import mock data
  var username = req.body.username;
  var password = req.body.password;
  const user = userList.find(user => user.username === username);
  if (!user) {
    res.status(401).send({ valid: 0, message: "Invalid Username or password" });
  } else if (user.password != password) {
    res.status(401).send({ valid: 0, message: "Invalid Username or password" });
  } else {
    res.status(200).send({valid: 1, message: "Login Success" })
  }
});

router.get('/dashboard', (req, res) => {
  res.status(200).send('Login success');
});

module.exports = router;