const express = require('express');
const router = express.Router();

const admin = require('../controllers/admin');

// Get user list
router.post('/userList', admin.getUserList);
router.post('/createUser', admin.createUser);
router.post('/updateUser', admin.updateUser);
router.post('/changePassword', admin.changePassword);
router.post('/removeUser', admin.deleteUser);

module.exports = router;