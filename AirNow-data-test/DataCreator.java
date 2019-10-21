import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Random;

/**
* 1 day -24h => 24 records
* 20 day => 480 records
* 3 field for each record => at least 1440 rows
*/

public class DataCreator {

  /* Configurable */
  //Output file name
  static File file = new File("data-test.txt");

  static int numberOfRecord = 11;
  static int timestampStart = 1569891600;

  // Random scope
  static Random rand = new Random();
  static int max = 179;
  static int min = 49;

  // Line format
  static String lineAqi = "air-aqi, location=%s, aqi=%d %d\n"; // location: string, aqi: int, timestamp: long

  public static void main(String[] args) {
    System.out.println("Creating sample data for influxdb");

    createAQI();
  }

  public static void createAQI() {
    try {
      FileWriter fileWriter = new FileWriter(file, true);
      PrintWriter printWriter = new PrintWriter(fileWriter);

      long timestamp = timestampStart;
      String line = "";
      int aqi;

      for (int i = 0; i < numberOfRecord; i++) {
        aqi = rand.nextInt((max - min) + 1) + min;
        line = String.format(lineAqi, "HCM", aqi, timestamp);

        printWriter.print(line);
        timestamp += 3600;  //Increase 1 hour
      }

      fileWriter.flush();
      fileWriter.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

}
