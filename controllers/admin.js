const User = require('../models/User');

const CODE = [
  { code: 'abc123' },
  { code: 'afbcdfs123123124' },
];

const getList = (req, res) => {

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

module.exports = {
  getList,
}