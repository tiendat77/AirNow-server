# Device mongodb
- [ ] db.createCollection("devices")
- [ ] db.devices.insert({device_id: 123})

# Statistic mongodb
- [ ] db.createCollection("statistics")
- [ ] db.statistics.insert([{title: "visit", value: 0}, {title: "download", value: 0}, {title: "upload", value: 0}, {title: "device", value: 0}])
- [ ] db.statistics.update({"title":"visit"}, {$inc:{"value": 1}})

# Users mongodb
- [] db.createCollection("users")
- [] db.users.insert({ name: "AirNow", email: "airnow@gmail.com", username: "airnow", password: "170587e83d7f4c5e3dd5e0d02198bc64" })
- [] db.users.insert({ name: "Mr Test", email: "mr.test@gmail.com", username: "test", password: "f5d1278e8109edd94e1e4197e04873b9" })
- [] db.users.insert({ name: "Tien Dat", email: "tiendat@gmail.com", username: "tiendat", password: "5f0ee0f5466db4834090d7118aa3878a" })

# Forecast influxdb
- [ ] influx -import -path=AirNow-data-test.txt -precision=s -database=AirNow_database

# Kill process on port 8000
```
sudo kill -9 `sudo lsof -t -i:8000`
```

# PM2
## Start process and name it
```
pm2 start app.js --name "airnow"
```

## Restart by name
```
pm2 restart "airnow"
```

## Delete process by name
```
pm2 delete "api"
```

## Kill all process run by pm2
```
pm2 kill
```

# MongoDB query
## Create database
```
use AirNow_database
```

Check databases
```
show dbs
```

## Drop database:
```
use AirNow_database
db.dropDatabase()
```

## Create collection
```
db.createCollection("COLLECTION_NAME")
```

## Drop collection
```
db.COLLECTION_NAME.drop()
show collections
```

## Insert
```
db.COLLECTION_NAME.insert(document)
```

## Query
```
db.COLLECTION_NAME.find()
db.COLLECTION_NAME.find({"title": "visit"})
```

## Update
```
db.COLLECTION_NAME.update({"title": "visit"}, {$set:{"value": 1}})
```

## Remove
```
db.COLLECTION_NAME.remove({"title": "visit"})
```

## Sort
```
db.statistics.find().sort({"title": -1})
```

