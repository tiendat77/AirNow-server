const express = require('express');
const router = express.Router();
moment = require('moment'); 

const Influx = require('influx');
const influx = new Influx.InfluxDB('http://127.0.0.1:8086/AirNow_database');


//Test connection
influx
  .getMeasurements()
  .then(names => console.log('My measurement names are: ' + names.join(', ')))
  .catch(error => console.error({ error }));

router.get('/select', (req, res) => {
  var aqi = req.query.aqi;
  var humi = req.query.humi;
  var temp = req.query.temp;
  var location = req.query.location;
  var limit = parseInt(req.query.limit);
  if (!limit || limit < 1) { limit = 50 };
  var qery;

  if (!aqi && !humi && !temp && !location) {
    qery = ` select * from air_aqi where time > '2019-10-18T01:00:00Z' limit ${limit} `;
    console.log(`select is error`);
  }
  if (!aqi && !humi && !temp && location) {
    qery = ` select * from air_aqi where location='${location}' and time > '2019-10-18T01:00:00Z' limit ${limit} `;
    console.log(`only location is exist`);
  }
  // ari_aqi
  if (aqi && !location) {
    qery = ` select * from air_aqi where aqi=${aqi} and time > '2019-10-18T01:00:00Z' limit ${limit} `;
  }
  else if (aqi && location) {
    qery = ` select * from air_aqi where aqi=${aqi} and location='${location}' and time > '2019-10-18T01:00:00Z' limit ${limit} `;
  }
  // air_temperature
  if (temp && !location) {
    qery = ` select * from air_temperature where degrees=${temp} and time > '2019-10-18T01:00:00Z' limit ${limit} `;
  }
  else if (temp && location) {
    qery = ` select * from air_temperature where degrees=${temp} and location='${location}' and time > '2019-10-18T01:00:00Z' limit ${limit} `;
  }
  // air_humidty
  if (humi && !location) {
    qery = ` select * from air_humidity where humidity=${humi} and time > '2019-10-18T01:00:00Z' limit ${limit} `;
  }
  else if (humi && location) {
    qery = ` select * from air_humidity where humidity=${humi} and location='${location}' and time > '2019-10-18T01:00:00Z' limit ${limit} `;
  }

  influx
    .query(qery)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(500).json({ error }));
});

router.get('/select-aqi', (req, res) => {
  const range = parseInt(req.query.range);
  const location = 'thu-duc';

  let limit=0;
  let query='';

  if (range && !isNaN(range)) {
    switch(range) {
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
    .then(result => res.status(200).json(result))
    .catch(error => res.status(500).json({ error }));
  } else {
    res.send({message: 'Range param is null'});
  }

});

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