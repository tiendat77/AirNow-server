const express = require('express');
const router = express.Router();

const device = require('../controllers/device');

router.post('/deviceList', device.deviceList);
router.post('/createDevice', device.createDevice);
router.post('/updateDevice', device.updateDevice);
router.post('/removeDevice', device.removeDevice);
router.post('/isOnline', device.isOnline);

module.exports = router;