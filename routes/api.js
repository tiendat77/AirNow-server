const express = require('express');
const router = express.Router();
const Influx = require('influx');
const influx = new Influx.InfluxDB('http://127.0.0.1:8086/AirNow_database');


//Test connection
influx.getMeasurements()
  .then(names => console.log('My measurement names are: ' + names.join(', ')))
  .catch(error => console.error({ error }));

router.get('/select', (request, response) => {
  influx.query(` select * from air_aqi where time > '2019-10-18T01:00:00Z' limit 50 `)
    .then(result => response.status(200).json( result ))
    .catch(error => response.status(500).json({ error }));
});

router.get('/insert', (request, response) => {

  var aqi = parseInt(request.query.aqi);
  var location = request.query.location;

  console.log(`insert aqi=${pH} location=${location}`);

  if (aqi && location && !isNaN(aqi)){
    influx.writePoints([{
      measurement: 'air_aqi',
      tags: {location: location},
      fields: {aqi: aqi}
    }])
    .then(result => response.status(200).json('success: true'))
    .catch(error => response.status(500).json({ error }));
  } else {
    response.status(500).send('Fail to insert record');
  }
});

module.exports = router;