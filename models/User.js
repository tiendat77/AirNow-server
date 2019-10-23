const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  NAME: {
    type: String,
    required: true
  },
  USERNAME: {
    type: String,
    required: true
  },
  PASSWORD: {
    type: String,
    required: true
  },
  DATE: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);
///User.create({
///  USERNAME:"admin123",
///  NAME: 'elip',
///  PASSWORD: "admin123"
///})
module.exports = User;
