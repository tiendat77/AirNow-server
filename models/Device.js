const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  device_id: Number
});

const Device = mongoose.model('Device', DeviceSchema);
module.exports = Device;