const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, '..', 'public/air-now', 'index.html'));
  res.redirect('/user/login');
});

module.exports = router;
