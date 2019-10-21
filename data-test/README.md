## Generate sample data:
```
javac DataCreator.java && java DataCreator
```

## Import sample data to influxdb:
```
influx -import -path=AirNow-data-test.txt -precision=s -database=AIRNOW_database
```