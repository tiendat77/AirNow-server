const User = require('../models/User');
const crypto = require('crypto');

const CODE = [
  { code: 'abc123' },
  { code: 'afbcdfs123123124' },
];

const getUserList = (req, res) => {

  const code = req.body.code;

  const validCode = CODE.filter(d => d.code === code);
  
  if (validCode && validCode[0] && validCode[0].code) {
    User
      .find({})
      .then(result => {
        res.status(200).json({ dataList: result });
      })
  } else {
    res.status(400).json({ error: 'unauthorized' });
  }

}

const createUser = (req, res) => {
  const code = req.body.code;
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  const validCode = CODE.filter(d => d.code === code);

  if (validCode && validCode[0] && validCode[0].code) {
    if (username && email && name) {
      User
      .findOne({ username: username }, (err, doc) => {
        if (err) {
          res.status(500).json({ error: 'something went wrong' });
          return;
        }
        if (doc) {
          res.status(400).json({ error: 'username is invalid' });
          return;
        }

        var hash;

        if (password) {
          hash = crypto.createHash('md5').update(password).digest('hex');
        } else {
          hash = crypto.createHash('md5').update('123456').digest('hex');
        }

        const newUser = new User({
          name: name,
          username: username,
          email: email,
          password: hash
        });

        newUser.save((err, doc) => {
          if (err) {
            
            return;
          }
        });
        console.log('hash - ', hash);
      });
    }
    // res.status(200).json({ success: true });
  } else {
    res.status(400).json({ error: 'unauthorized' });
  }
};

const updateUser = (req, res) => {
  const code = req.body.code;

  const validCode = CODE.filter(d => d.code === code);

  if (validCode && validCode[0] && validCode[0].code) {
    console.log('valid');
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ error: 'unauthorized' });
  }
};

const deleteUser = (req, res) => {
  const code = req.body.code;

  const validCode = CODE.filter(d => d.code === code);

  if (validCode && validCode[0] && validCode[0].code) {
    console.log('valid');
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ error: 'unauthorized' });
  }
};

module.exports = {
  getUserList,
  createUser,
  updateUser,
  deleteUser
}