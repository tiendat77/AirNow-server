import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Random;

public class DataCreator {

  /* Configurable */
  // ---- Output file name ----
  static File file = new File("AirNow-data-test.txt");

  static int numberOfRecord = 200;
  static int timestampStart = 1569891600;
  static int timeStep = 7200;

  // ---- Random scope ----
  static Random rand = new Random();
  static int maxAqi = 179;
  static int minAqi = 49;
  static int maxPollutant = 79;
  static int minPollutant = 21;
  static int maxTemp = 38;
  static int minTemp = 32;
  static int maxHumi = 66;
  static int minHumi = 55;

  // ---- Line format ----
  // static String location = "Thủ\\ Đức";
  // static String location = "Bình\\ Thạnh";
  static String location = "Đông\\ Hòa";

  static String lineAqi = "air_aqi,location=%s pollutant=%f,aqi=%d,description=\"%s\" %d\n";
  // location: string, pollutant: float, aqi: int, description: string timestamp: long
  static String lineTemperature = "air_temperature,location=%s degrees=%d %d\n";
  // location: string, degrees: int timstamp: long
  static String lineHumidity = "air_humidity,location=%s humidity=%d %d\n";
  // location: string, humidity: int timstamp: long
  
  static int AQI_LEVELS = 7;
  
  static pm25aqiModel[] pm25aqi = {
    new pm25aqiModel(0.0, 12.0, 0, 50),
    new pm25aqiModel(12.1, 35.4, 51, 100),
    new pm25aqiModel(35.5, 55.4, 101, 150),
    new pm25aqiModel(55.5, 150.4, 151, 200),
    new pm25aqiModel(150.5, 250.4, 201, 300),
    new pm25aqiModel(250.5, 350.4, 301, 350),
    new pm25aqiModel(350.5, 500.4, 401, 500),
  };
  

  public static void main(String[] args) {
    System.out.println("Creating sample data for influxdb");

    init();
    createAQI();
    createTemperature();
    createHumidity();

    System.out.println("Done!");
  }

  public static void init() {
    try {
      FileWriter fileWriter = new FileWriter(file, true);
      PrintWriter printWriter = new PrintWriter(fileWriter);

      printWriter.print("# DDL\n\nCREATE DATABASE AirNow_database\n\n# DML\n\n# CONTEXT-DATABASE: AirNow_database\n\n");

      fileWriter.flush();
      fileWriter.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public static void createAQI() {
    try {
      FileWriter fileWriter = new FileWriter(file, true);
      PrintWriter printWriter = new PrintWriter(fileWriter);

      long timestamp = timestampStart;
      String line = "";
      int aqi;
	    float pollutant;
      String descript = "";

      for (int i = 0; i < numberOfRecord; i++) {
		    pollutant = rand.nextFloat()*(maxPollutant - minPollutant) + minPollutant;
        aqi = ugm3_aqi(pollutant);
        descript = getDescription(aqi);
        line = String.format(lineAqi, location, pollutant, aqi, descript, timestamp);

        printWriter.print(line);
        timestamp += timeStep;
      }

      fileWriter.flush();
      fileWriter.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
  
  public static int ugm3_aqi(float concentration_ugm3)
	{
	  for (int i = 0; i < AQI_LEVELS; i++)
	  {
      if (concentration_ugm3 >= pm25aqi[i].clow && concentration_ugm3 <= pm25aqi[i].chigh)
      {
        int result = (int) (((pm25aqi[i].lhigh - pm25aqi[i].llow) /
                              (pm25aqi[i].chigh - pm25aqi[i].clow)) *
                              (concentration_ugm3 - pm25aqi[i].clow) +
                              pm25aqi[i].llow);
        return result;
      }
	  }
	  return 0;
  }

  public static String getDescription(int aqi) {
    String result = "";

    if (aqi > 0 && aqi < 51) {
      result = "Good";
    } else if (aqi > 50 && aqi < 101) {
      result = "Moderate";
    } else if (aqi > 100 && aqi < 151) {
      result = "Unhealthy for Sensitive Groups";
    } else if (aqi > 150 && aqi < 201) {
      result = "Unhealthy";
    } else if (aqi > 200 && aqi < 301) {
      result = "Very Unhealthy";
    } else if (aqi > 300) {
      result = "Hazardous";
    }

    return result;
  }

  public static void createTemperature() {
    try {
      FileWriter fileWriter = new FileWriter(file, true);
      PrintWriter printWriter = new PrintWriter(fileWriter);

      long timestamp = timestampStart;
      String line = "";
      int temp;

      for (int i = 0; i < numberOfRecord; i++) {
        temp = rand.nextInt((maxTemp - minTemp) + 1) + minTemp;
        line = String.format(lineTemperature, location, temp, timestamp);

        printWriter.print(line);
        timestamp += timeStep;
      }

      fileWriter.flush();
      fileWriter.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public static void createHumidity() {
    try {
      FileWriter fileWriter = new FileWriter(file, true);
      PrintWriter printWriter = new PrintWriter(fileWriter);

      long timestamp = timestampStart;
      String line = "";
      int humi;

      for (int i = 0; i < numberOfRecord; i++) {
        humi = rand.nextInt((maxHumi - minHumi) + 1) + minHumi;
        line = String.format(lineHumidity, location, humi, timestamp);

        printWriter.print(line);
        timestamp += timeStep;
      }

      fileWriter.flush();
      fileWriter.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

}

// ---- struct pm25aqi ----
class pm25aqiModel {
  public double clow;
  public double chigh;
  public int llow;
  public int lhigh;

  public pm25aqiModel() {

  }
  
  public pm25aqiModel(double clow, double chigh, int llow, int lhigh) {
    this.clow = clow;
    this.chigh = chigh;
    this.llow = llow;
    this.lhigh = lhigh;
  }
}
