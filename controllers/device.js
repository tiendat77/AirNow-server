const Device = require('../models/Device');

const CODE = [
  { code: '93cf8cb6e31a3c5fddc70e8a0bb86075' },
  { code: 'c5302be3d3f814de027420ad92323a7f' },
  { code: '485c4188d9161c3b7ff5c187151bfcb6' },
];

const deviceList = (req, res) => {
  const code = req.body.code;
  
  const validCode = CODE.filter(d => d.code === code);
  
  if (validCode && validCode[0] && validCode[0].code) {
    Device
      .find({})
      .then(result => {
        res.status(200).json({ dataList: result });
      })
  } else {
    res.status(401).json({ error: 'unauthorized' });
  }

};

const createDevice = (req, res) => {
  const code = req.body.code;
  const id = req.body.id;
  const location = req.body.location;

  const validCode = CODE.filter(d => d.code === code);

  if (validCode && validCode[0] && validCode[0].code) {
    if (id && location) {
      Device.findOne({ id: id }, (err, doc) =>{
        if (err) {
          res.status(500).json({ error: 'Something went wrong!' });
          return;
        }
        if (doc) {
          res.status(400).json({ error: 'Device id is already exists' });
          return;
        }

        const newDevice = new Device({
          id: id,
          location: location
        });

        newDevice.save((err, doc) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong!' })
            return;
          }
          res.status(200).json({ message: 'Device created!' });
        })
      });

    } else {
      res.status(400).json({ error: 'Bad request' });
    }

  } else {
    res.status(401).json({ error: 'unauthorized' });
  }
};

const updateDevice = (req, res) => {
  const code = req.body.code;
  const id = req.body.id;
  const location = req.body.location;

  const validCode = CODE.filter(d => d.code === code);

  if (validCode && validCode[0] && validCode[0].code) {

    if (id && location) {
      const filter = { id: id };
      const update = {
        location: location
      };

      Device.findOneAndUpdate(filter, update, (err, doc) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Something went wrong!' })
          return;
        }
        res.status(200).json({ message: 'Device updated!' });
      });
    } else {
      res.status(400).json({ error: 'Bad request' });
    }
  } else {
    res.status(401).json({ error: 'unauthorized' });
  }
};

const removeDevice = (req, res) => {
  const code = req.body.code;
  const id = req.body.id;

  const validCode = CODE.filter(d => d.code === code);

  if (validCode && validCode[0] && validCode[0].code) {
    if (id) {
      Device.findOneAndRemove({ id: id }, (err, doc)=> {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Something went wrong!' })
          return;
        }
        if (doc) {
          res.status(200).json({ message: 'Device removed!' });
        } else {
          res.status(200).json({ message: 'Device not found!' });
        }
      });
      
    } else {
      res.status(400).json({ error: 'Bad request' });
    }
  } else {
    res.status(401).json({ error: 'unauthorized' });
  }
};

const isOnline = (req, res) => {
  const code = req.body.code;
  const id = req.body.id;

  const validCode = CODE.filter(d => d.code === code);

  if (validCode && validCode[0] && validCode[0].code) {
    if (id) {
      // Check online here
      res.status(200).json({ message: 'Device checkeddddd' });
    } else {
      res.status(400).json({ error: 'Bad request' });
    }
  } else {
    res.status(401).json({ error: 'unauthorized' });
  }
};

module.exports = {
  deviceList,
  createDevice,
  updateDevice,
  removeDevice,
  isOnline
};