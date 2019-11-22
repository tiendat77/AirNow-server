const User = require('../models/User');
const crypto = require('crypto');

const CODE = [
  { code: '93cf8cb6e31a3c5fddc70e8a0bb86075' },
  { code: 'c5302be3d3f814de027420ad92323a7f' },
  { code: '485c4188d9161c3b7ff5c187151bfcb6' },
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
    res.status(401).json({ error: 'unauthorized' });
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
          res.status(500).json({ error: 'Something went wrong!' });
          return;
        }
        if (doc) {
          res.status(400).json({ error: 'Username is already exists' });
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
            console.error(err);
            res.status(500).json({ error: 'Something went wrong!' })
            return;
          }
          res.status(200).json({ message: 'User created!' });
        });
      });
    } else {
      res.status(400).json({ error: 'Bad request' });
    }
  } else {
    res.status(401).json({ error: 'unauthorized' });
  }
};

const updateUser = (req, res) => {
  const code = req.body.code;
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;

  const validCode = CODE.filter(d => d.code === code);

  if (validCode && validCode[0] && validCode[0].code) {

    if (username && email && name) {
      const filter = { username: username };
      const update = {
        name: name,
        email: email
      };

      User.findOneAndUpdate(filter, update, (err, doc) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Something went wrong!' })
          return;
        }
        res.status(200).json({ message: 'User updated!' });
      });
    } else {
      res.status(400).json({ error: 'Bad request' });
    }
  } else {
    res.status(401).json({ error: 'unauthorized' });
  }
};

const changePassword = (req, res) => {
  const code = req.body.code;
  const username = req.body.username;
  const password = req.body.password;

  const validCode = CODE.filter(d => d.code === code);

  if (validCode && validCode[0] && validCode[0].code) {
    if (username && password) {
      const filter = { username: username };
      const hash = crypto.createHash('md5').update(password).digest('hex');
      const update = { password: hash };

      User.findOneAndUpdate(filter, update, (err, doc) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Something went wrong!' })
          return;
        }
        res.status(200).json({ message: 'Password updated!' });
      });
    } else {
      res.status(400).json({ error: 'Bad request' });
    }
  } else {
    res.status(401).json({ error: 'unauthorized' });
  }
};

const deleteUser = (req, res) => {
  const code = req.body.code;
  const username = req.body.username;

  const validCode = CODE.filter(d => d.code === code);

  if (validCode && validCode[0] && validCode[0].code) {
    if (username) {
      User.findOneAndRemove({ username: username }, (err, doc)=> {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Something went wrong!' })
          return;
        }
        if (doc) {
          res.status(200).json({ message: 'User deleted!' });
        } else {
          res.status(200).json({ message: 'User not found!' });
        }
      });
      
    } else {
      res.status(400).json({ error: 'Bad request' });
    }
  } else {
    res.status(401).json({ error: 'unauthorized' });
  }
};

module.exports = {
  getUserList,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
}