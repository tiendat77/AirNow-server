# Statistic mongodb
- [ ] db.createCollection("statistics")
- [ ] db.statistics.insert({visit: 0})
- [ ] db.statistics.insert({download: 0})
- [ ] db.statistics.insert({upload: 0})
- [ ] db.statistics.insert({device: 0})

# Please don't push public/

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