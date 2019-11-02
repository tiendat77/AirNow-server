const express = require('express');
const router = express.Router();
moment = require('moment');

const Influx = require('influx');
const influx = new Influx.InfluxDB('http://127.0.0.1:8086/AirNow_database');

const statistic = require('../controllers/statistic');

//Test connection
influx
  .getMeasurements()
  .then(names => console.log('My measurement names are: ' + names.join(', ')))
  .catch(error => console.error({ error }));

router.get('/select-aqi', (req, res) => {
  const range = parseInt(req.query.range);
  let location = req.query.location;
  let limit = 0;
  let query = '';

  if (!location) {
    location = 'thu-duc';
  }
  if (range && !isNaN(range)) {
    switch (range) {
      case 1: {
        query = `SELECT * FROM air_aqi WHERE location='${location}' GROUP BY * ORDER BY DESC LIMIT 1`;
        break;
      }

      case 7: {
        limit = moment().subtract(7, 'days').unix();
        query = `SELECT * FROM air_aqi WHERE location='${location}' AND time > ${limit} ORDER BY time DESC`;
        break;
      }

      case 30: {
        limit = moment().subtract(1, 'months').unix();
        query = `SELECT * FROM air_aqi WHERE location='${location}' AND time > ${limit} ORDER BY time DESC`;
        break;
      }

      default: {
        query = `SELECT * FROM air_aqi WHERE location='${location}' GROUP BY * ORDER BY DESC LIMIT ${range}`;
        break;
      }
    }

    influx
      .query(query)
      .then(result => {
        statistic.download();
        res.status(200).json(result);
      })
      .catch(error => res.status(500).json({ error }));
  } else {
    res.send({ message: 'Range param is null' });
  }

});

router.get('/select-humidity', (req, res) => {
  const range = parseInt(req.query.range);
  let location = req.query.location;
  let limit = 0;
  let query = '';

  if (!location) {
    location = 'thu-duc';
  }
  if (range && !isNaN(range)) {
    switch (range) {
      case 1: {
        query = `SELECT * FROM air_humidity WHERE location='${location}' GROUP BY * ORDER BY DESC LIMIT 1`;
        break;
      }

      case 7: {
        limit = moment().subtract(7, 'days').unix();
        query = `SELECT * FROM air_humidity WHERE location='${location}' AND time > ${limit} ORDER BY time DESC`;
        break;
      }

      case 30: {
        limit = moment().subtract(1, 'months').unix();
        query = `SELECT * FROM air_humidity WHERE location='${location}' AND time > ${limit} ORDER BY time DESC`;
        break;
      }

      default: {
        query = `SELECT * FROM air_humidity WHERE location='${location}' GROUP BY * ORDER BY DESC LIMIT ${range}`;
        break;
      }
    }

    influx
      .query(query)
      .then(result => {
        statistic.download();
        res.status(200).json(result);
      })
      .catch(error => res.status(500).json({ error }));
  } else {
    res.send({ message: 'Range param is null' });
  }

});

router.get('/select-temperature', (req, res) => {
  const range = parseInt(req.query.range);
  let location = req.query.location;
  let limit = 0;
  let query = '';

  if (!location) {
    location = 'thu-duc';
  }
  if (range && !isNaN(range)) {
    switch (range) {
      case 1: {
        query = `SELECT * FROM air_temperature WHERE location='${location}' GROUP BY * ORDER BY DESC LIMIT 1`;
        break;
      }

      case 7: {
        limit = moment().subtract(7, 'days').unix();
        query = `SELECT * FROM air_temperature WHERE location='${location}' AND time > ${limit} ORDER BY time DESC`;
        break;
      }

      case 30: {
        limit = moment().subtract(1, 'months').unix();
        query = `SELECT * FROM air_temperature WHERE location='${location}' AND time > ${limit} ORDER BY time DESC`;
        break;
      }

      default: {
        query = `SELECT * FROM air_temperature WHERE location='${location}' GROUP BY * ORDER BY DESC LIMIT ${range}`;
        break;
      }
    }

    influx
      .query(query)
      .then(result => {
        statistic.download();
        res.status(200).json(result);
      })
      .catch(error => res.status(500).json({ error }));
  } else {
    res.send({ message: 'Range param is null' });
  }

});

router.get('/statistics', statistic.getAll);

// Delete this
router.get('/insert', (request, response) => {

  var aqi = parseInt(request.query.aqi);
  var location = request.query.location;

  console.log(`insert aqi=${pH} location=${location}`);

  if (aqi && location && !isNaN(aqi)) {
    influx.writePoints([{
      measurement: 'air_aqi',
      tags: { location: location },
      fields: { aqi: aqi }
    }])
      .then(result => response.status(200).json('success: true'))
      .catch(error => response.status(500).json({ error }));

  } else {
    response.status(500).send('Fail to insert record');
  }
});

module.exports = router;