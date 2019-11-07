const express = require('express');
const router = express.Router();
const Influx = require('influx');
const Device = require('../models/Device');
const SERVER_URL = 'http://13.59.35.198:8086/AirNow_database';
const LOCAL_URL = 'http://127.0.0.1:8086/AirNow_database';
const influx = new Influx.InfluxDB(LOCAL_URL);

const statistic = require('../controllers/statistic');
router.get('/', (req, res) => {

  const result = {
    message: 'get success!',
    para: req.query.para
  };

  res.status(200).json(result);

  console.log('ESP32 Get requested!');
});

// Checking the database
influx
  .getDatabaseNames()
  .then(names => {
    if (!names.includes('AirNow_database')) {
      return influx.createDatabase('AirNow_database');
    }
  });

router.post('/', (req, res) => {

  console.log('ESP32 Post requested!');
  statistic.upload();
  var aqi = parseFloat(req.body.aqi);
  var location = req.body.location;
  var humi = parseFloat(req.body.humi);
  var temp = parseFloat(req.body.temp);
  var device_id = parseInt(req.body.device_id);
  var error = "";
  var descript = "";

  if (aqi > 0 && aqi < 51) {
    descript = "Good";
  } else if (aqi > 50 && aqi < 101) {
    descript = "Moderate";
  } else if (aqi > 100 && aqi < 151) {
    descript = "Unhealthy for Sensitive Groups";
  } else if (aqi > 150 && aqi < 201) {
    descript = "Unhealthy";
  } else if (aqi > 200 && aqi < 301) {
    descript = "Very Unhealthy";
  } else if (aqi > 300) {
    descript = "Hazardous";
  }
  if (device_id && !isNaN(device_id)) {
    Device.findOne({ device_id: device_id }, function (err, device) {
      if (err) { return done(err); }
      if (!device) {
        res.status(401).send({ message: 'Unauthorized' });
      }
      else {
        if ((aqi && !isNaN(aqi)) && (temp && !isNaN(temp)) && (humi && !isNaN(humi)) && location) {
          console.log(`insert aqi=${aqi} description=${descript} location=${location}`);
          influx
            .writePoints([{
              measurement: 'air_aqi',
              tags: { location: location },
              fields: {
                aqi: aqi,
                description: descript
              }
            }])
            .catch(error => res.status(500).json({ error }));

          console.log(`insert temperature=${temp} location=${location}`);
          influx
            .writePoints([{
              measurement: 'air_temperature',
              tags: { location: location },
              fields: { degrees: temp }
            }])
            .catch(error => res.status(500).json({ error }));

          console.log(`insert humi=${humi} location=${location}`);
          influx
            .writePoints([{
              measurement: 'air_humidity',
              tags: { location: location },
              fields: { humidity: humi }
            }])
            .catch(error => res.status(500).json({ error }));
          res.status(200).send({ message: 'Insert successful' });
        }
        else {
          res.status(400).send({ message: 'Bad request' });
          console.log(`false`);
        }
      }
    })

  } else {
    res.status(401).send({ message: 'Unauthorized' });
    console.log(`false`);
  };

});

module.exports = router;
