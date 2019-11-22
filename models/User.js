const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
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
  }
});

UserSchema.methods.validPassword = function (password) {
  var hash = crypto.createHash('md5').update(password).digest('hex');
  if (hash === this.password) {
    return true;
  } else {
    return false;
  }
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
