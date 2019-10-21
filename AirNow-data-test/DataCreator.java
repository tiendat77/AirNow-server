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

  static File file = new File("data-test.txt");

  static Random rand = new Random();
  static int max = 179;
  static int min = 49;

  static String lineAqi = "air-aqi, location=%s, aqi=%d %d\n"; // location: string, aqi: int, timestamp: long

  public static void main(String[] args) {
    System.out.println("Creating sample data for ...");

    createAQI();
  }

  public static void createAQI() {
    try {
      FileWriter fileWriter = new FileWriter(file, true);
      PrintWriter printWriter = new PrintWriter(fileWriter);

      long timestamp = 1569891600;
      String line = "";
      int aqi;

      for (int i = 0; i < 10; i++) {
        aqi = rand.nextInt((max - min) + 1) + min;
        line = String.format(lineAqi, "HCM", aqi, timestamp);
        // printWriter.print(line + ", aqi= "+ aqi + ", " + timestamp + "\n");
        printWriter.print(line);
        timestamp += 3600;
      }

      fileWriter.flush();
      fileWriter.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

}
