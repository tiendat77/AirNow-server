# rule
```json
  {
    time: "12h-14h",
    step: "20minute"
    record: "6",
    temperature: {
      status: "increment",
      min: 29.9,
      max: 32.8,
      random: 0.3-0.5
    },
    humidity: {
      status: "decrement",
      min: 40.4,
      max: 46,
      random: 0.7-1
    },
    aqi: {
      status: "",
      min: 82,
      max: 120,
      random: 10,
    }
  },
  {
    time: "14h-16h",
    step: "20minute"
    record: "6",
    temperature: {
      status: "decrement",
      min: 29.9,
      max: 32.8,
      random: 0.3-0.5
    },
    humidity: {
      status: "increment",
      min: 46.5,
      max: 56.2,
      random: 0.7-1
    },
    aqi: {
      status: "sight descrement",
      min: 30,
      max: 45,
      random: 5,
    }
  },
  {
    time: "19h30-23h30",
    step: "20minute"
    record: "12",
    temperature: {
      status: "decrement",
      min: 29.7,
      max: 27.8,
      random: 0.2-0.3
    },
    humidity: {
      status: "increment",
      min: 52.2,
      max: 62.1,
      random: 0.6-0.9
    },
    aqi: {
      status: "descrement",
      min: 24,
      max: 41,
      random: 5,
    }
  }
```


# Delete data influxdb 
SELECT * INTO <new_measurement> FROM <measurement_name> WHERE <condition> group by * (If you don't specify group by *, the tags will turn into fields)
# Copy all valid data to a temporary measurement (if delete data >170)
SELECT * INTO air_aqi_clean FROM air_aqi WHERE aqi<131 group by *

# Drop existing dirty measurement
DROP measurement air_aqi

# Copy temporary measurement to existing measurement
SELECT * INTO air_aqi FROM air_aqi_clean group by *

# Drop existing dirty measurement
DROP measurement air_aqi_clean

# air_temperature
SELECT * INTO air_temperature_clean FROM air_temperature WHERE degrees<33 group by *

DROP measurement air_temperature

SELECT * INTO air_temperature FROM air_temperature_clean group by *

DROP measurement air_temperature_clean
