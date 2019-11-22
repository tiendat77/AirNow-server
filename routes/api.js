const express = require('express');
const router = express.Router();
moment = require('moment');

const Influx = require('influx');
const influx = new Influx.InfluxDB('http://127.0.0.1:8086/AirNow_database');

const statistic = require('../controllers/statistic');
const { ensureAuthenticatedApi } = require('../config/auth');

// Test connection
influx
  .getMeasurements()
  .then(names => console.log('InfluxDB Connected: ' + names.join(', ')))
  .catch(error => console.error({ error }));

// router.get('/statistics', ensureAuthenticatedApi, statistic.getAll);
router.get('/statistics', statistic.getAll);

router.get('/forecast', (req, res) => {
  const query = [
    'SELECT * FROM air_aqi GROUP BY location ORDER BY DESC LIMIT 1',
    'SELECT * FROM air_temperature GROUP BY location ORDER BY DESC LIMIT 1',
    'SELECT * FROM air_humidity GROUP BY location ORDER BY DESC LIMIT 1',
  ];
  influx
    .query(query)
    .then(result => {
      statistic.download();
      const forecast = [];
      let k = 0;

      for (let i = 0; i < result[0].length; i++) {
        let object = {}; 
        object['time'] = result[0][i].time;
        object['aqi'] = result[0][i].aqi;
        object['status'] = result[0][i].description;
        object['temperature'] = result[1][i].degrees;
        object['humidity'] = result[2][i].humidity;
        object['pollutant'] = result[0][i].pollutant;
        object['location'] = result[0][i].location;
        forecast.push(object);
      }
      res.status(200).json({ forecast });
    })
    .catch(error => res.status(500).json({ error }));
});

router.get('/locations', (req, res) => {
  influx
    .query('SELECT "location", "aqi" FROM air_aqi GROUP BY location ORDER BY DESC LIMIT 1')
    .then(result => {
      statistic.download();
      const locations = [];
      for (let i = 0; i < result.length; i++) {
        if (result[i].location) {
          locations.push(result[i].location);
        }
      }
      res.status(200).json({ locations });
    })
    .catch(error => res.status(500).json({ error: 'Error has occurred!' }));
});

router.get('/airdata', (req, res) => {
  const range = parseInt(req.query.range);
  let location = req.query.location;
  const query = [];
  console.log('Requset air data ', req.query);

  if (location === undefined) {
    location = 'Thủ Đức';
  }

  if (range && !isNaN(range)) {
    switch (range) {
      case 1: {
        query.push(`SELECT * FROM air_aqi WHERE location='${location}' AND time > now() - 1d  GROUP BY * ORDER BY time DESC`);
        query.push(`SELECT * FROM air_humidity WHERE location='${location}' AND time > now() - 1d  GROUP BY * ORDER BY time DESC`);
        query.push(`SELECT * FROM air_temperature WHERE location='${location}' AND time > now() - 1d  GROUP BY * ORDER BY time DESC`);
        break;
      }

      case 7: {
        query.push(`SELECT * FROM air_aqi WHERE location='${location}' AND time > now() -7d ORDER BY time DESC`);
        query.push(`SELECT * FROM air_humidity WHERE location='${location}' AND time > now() -7d ORDER BY time DESC`);
        query.push(`SELECT * FROM air_temperature WHERE location='${location}' AND time > now() -7d ORDER BY time DESC`);
        break;
      }

      case 30: {
        query.push(`SELECT * FROM air_aqi WHERE location='${location}' AND time > now() - 30d ORDER BY time DESC`);
        query.push(`SELECT * FROM air_humidity WHERE location='${location}' AND time > now() - 30d ORDER BY time DESC`);
        query.push(`SELECT * FROM air_temperature WHERE location='${location}' AND time > now() - 30d ORDER BY time DESC`);
        break;
      }

      default: {
        query.push(`SELECT * FROM air_aqi WHERE location='${location}' GROUP BY * ORDER BY DESC LIMIT ${range}`);
        query.push(`SELECT * FROM air_humidity WHERE location='${location}' GROUP BY * ORDER BY DESC LIMIT ${range}`);
        query.push(`SELECT * FROM air_temperature WHERE location='${location}' GROUP BY * ORDER BY DESC LIMIT ${range}`);
        break;
      }
    }

    influx
      .query(query)
      .then(result => {
        statistic.download();
        const data = {};
        data['aqi'] = result[0];
        data['humidity'] = result[1];
        data['temperature'] = result[2];
        res.status(200).json(data);
      })
      .catch(error => res.status(500).json({ error }));
  } else {
    res.status(400).json({ message: 'Null param' });
  }
});

module.exports = router;