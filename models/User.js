const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

UserSchema.methods.validPassword = function (password) {
  if (password === this.password) {
    return true;
  } else {
    return false;
  }
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
