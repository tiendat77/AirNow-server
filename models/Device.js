const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
});

const Device = mongoose.model('Device', DeviceSchema);

module.exports = Device;