const express = require('express');
const router = express.Router();

const admin = require('../controllers/admin');

// Get user list
router.post('/userList', admin.getUserList);
router.post('/updateUser', admin.updateUser);
router.post('/createUser', admin.createUser);

module.exports = router;