# Statistic mongodb
- [ ] db.createCollection("statistics")
- [ ] db.statistics.insert([{title: "visit", value: 0}, {title: "download", value: 0}, {title: "upload", value: 0}, {title: "device", value: 0}])
- [ ] db.statistics.update({"title":"visit"}, {$inc:{"value": 1}})

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

