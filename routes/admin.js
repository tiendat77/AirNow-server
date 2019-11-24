const express = require('express');
const router = express.Router();

const admin = require('../controllers/admin');

router.post('/userList', admin.getUserList);
router.post('/createUser', admin.createUser);
router.post('/updateUser', admin.updateUser);
router.post('/changePassword', admin.changePassword);
router.post('/removeUser', admin.removeUser);

module.exports = router;