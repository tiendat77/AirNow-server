const express = require('express');
const router = express.Router();
const Influx = require('influx');
const influx = new Influx.InfluxDB('http://127.0.0.1:8086/AirNow_database');

router.get('/', (req, res) => {

  const result = {
    message: 'get success!',
    para: req.query.para
  };

  res.status(200).json(result);

  console.log('ESP32 Get requested!');
});

// Checking the database
influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('AirNow_database')) {
      return influx.createDatabase('AirNow_database');
    }
  });
//ckech Measurements
influx.getMeasurements()
  .then(names => console.log('My measurement names are: ' + names.join(', ')))
  .catch(error => console.error({ error }));

router.post('/', (req, res) => {

  console.log('ESP32 Post requested!');

  var aqi = parseFloat(req.body.aqi);
  var location = req.body.location;
  var humi = parseFloat(req.body.humi);
  var temp = parseFloat(req.body.temp);
  var error="";
  var result;
  var descript;
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
 
  console.log(`insert aqi=${aqi} description=${descript} location=${location}`);
  if (aqi && location && !isNaN(aqi)){
    influx.writePoints([{
      measurement: 'air_aqi',
      tags: {location: location},
      fields: {aqi: aqi,
               description: descript}
    }])
    .catch(error => res.status(500).json({ error }));
  } else {
 
    error +="Fail to insert aqi ";
    console.log(`insert false`);
  }
  
  console.log(`insert temperature=${temp} location=${location}`);
  if (temp && location && !isNaN(temp)){
    influx.writePoints([{
      measurement: 'air_temperature',
      tags: {location: location},
      fields: {degrees: temp}
    }])
    .catch(error => res.status(500).json({ error }));

  } else {
 
  error +="Fail to insert temperature";
  console.log(`insert false`);
  }
  
  console.log(`insert humi=${humi} location=${location}`);
  if (humi && location && !isNaN(humi)){
    influx.writePoints([{
      measurement: 'air_humidity',
      tags: {location: location},
      fields: {humidity: humi}
    }])
    .catch(error => res.status(500).json({ error }));
  } else {
    error +="Fail to insert humidity ";
    console.log(`insert false`);
  }

  if(error) res.status(500).json({ error });
  else res.status(201).json('success: true all')
});

module.exports = router;
