const express = require('express');
const router = express.Router();
const Influx = require('influx');
const influx = new Influx.InfluxDB('http://127.0.0.1:8086/AirNow_database');

const logger = require('../log/logger');
const Device = require('../models/Device');
const statistic = require('../controllers/statistic');

// Checking the database
influx
  .getDatabaseNames()
  .then(names => {
    if (!names.includes('AirNow_database')) {
      return influx.createDatabase('AirNow_database');
    }
  });

router.post('/', (req, res) => {

  logger.info('ESP32 post requested!');
  statistic.upload();
  var aqi = parseFloat(req.body.aqi);
  var pollutant = parseFloat(req.body.pollutant);
  var location = req.body.location;
  var humi = parseFloat(req.body.humi);
  var temp = parseFloat(req.body.temp);
  var device_id = parseInt(req.body.device_id);
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
    Device.findOne({ id: device_id }, function (err, device) {
      if (err) { return done(err); }
      if (!device) {
        logger.info('Unauthorized');
        res.status(401).json({ message: 'Unauthorized' });
      } else {
        if ((aqi && !isNaN(aqi)) && (pollutant && !isNaN(pollutant)) && (temp && !isNaN(temp)) && (humi && !isNaN(humi)) && location) {
          console.log(`insert aqi=${aqi} pollutant=${pollutant} description=${descript} location=${location}`);
          influx
            .writePoints([{
              measurement: 'air_aqi',
              tags: { location: location },
              fields: {
                aqi: aqi,
                pollutant: pollutant,
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
          logger.info('Insert successful');
          res.status(200).json({ message: 'Insert successful' });
        }
        else {
          logger.info('Insert flase');
          res.status(400).json({ message: 'Bad request' });
        }
      }
    })

  } else {
    logger.info('Unauthorized');
    res.status(401).send({ message: 'Unauthorized' });
    
  };

});

module.exports = router;
