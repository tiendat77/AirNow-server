const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

  const result = {
    message: 'get success!',
    para: req.query.para
  };

  res.status(200).json(result);

  console.log('ESP32 Get requested!');
});

router.post('/', (req, res) => {
  const result = {
    message: 'post success!',
    temp: req.body.temp,
    humi: req.body.humi,
    aqi: req.body.aqi,
    sample: req.body.sample,
    locate: req.body.locate
  };

  res.status(200).json(result);

  console.log('ESP32 Post requested!');
});

module.exports = router;