import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Random;

/**
* 1 day -24h => 24 records
* 30 day => 720 records
* 3 field for each record => at least 2160 rows
*/

public class DataCreator {

  /* Configurable */
  //Output file name
  static File file = new File("AirNow-data-test.txt");

  static int numberOfRecord = 360;
  static int timestampStart = 1569891600;

  // Random scope
  static Random rand = new Random();
  static int maxAqi = 179;
  static int minAqi = 49;
  static int maxTemp = 38;
  static int minTemp = 25;
  static int maxHumi = 98;
  static int minHumi = 70;

  // Line format
  static String location = "Thủ\\ Đức";
  static String lineAqi = "air_aqi,location=%s aqi=%d,description=\"%s\" %d\n";   // location: string, aqi: int, description: string timestamp: long
  static String lineTemperature = "air_temperature,location=%s degrees=%d %d\n";   // location: string, degrees: int timstamp: long
  static String lineHumidity = "air_humidity,location=%s humidity=%d %d\n";        // location: string, humidity: int timstamp: long

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
      String descript = "";

      for (int i = 0; i < numberOfRecord; i++) {
        aqi = rand.nextInt((maxAqi - minAqi) + 1) + minAqi;
        descript = getDescription(aqi);
        line = String.format(lineAqi, location, aqi, descript, timestamp);

        printWriter.print(line);
        timestamp += 7200;  //Increase 1 hour
      }

      fileWriter.flush();
      fileWriter.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
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
        timestamp += 7200;  //Increase 1 hour
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
        timestamp += 7200;  //Increase 1 hour
      }

      fileWriter.flush();
      fileWriter.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

}
