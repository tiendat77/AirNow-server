import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Random;

public class DataCreator {

  /* Configurable */
  // ---- Output file name ----
  static File file = new File("AirNow-data.txt");

  static int numberOfRecord = 6;
  static long timestampStart = 1582261213;
  static long timestamp = 1582261213;
  static int timeStep = 1200;
  static int linear = 1;

  // static String location = "Thủ\\ Đức";
  static String location = "Bình\\ Thạnh";
  // static String location = "Đông\\ Hòa";

  // ---- Random scope ----
  static Random rand = new Random();
  static int maxAqi = 179;
  static int minAqi = 49;
  static float maxPollutant = 33;
  static float minPollutant = 21;
  static float maxTemp = 31;
  static float minTemp = 28;
  static float maxHumi = 66;
  static float minHumi = 55;
  static float mmaxPollutant = 33;
  static float mminPollutant = 21;
  static float mmaxTemp = 31;
  static float mminTemp = 28;
  static float mmaxHumi = 66;
  static float mminHumi = 55;

  // ---- Line format ----
  static String lineAqi = "air_aqi,location=%s pollutant=%f,aqi=%d,description=\"%s\" %d\n";
  // location: string, pollutant: float, aqi: int, description: string timestamp: long
  static String lineTemperature = "air_temperature,location=%s degrees=%f %d\n";
  // location: string, degrees: int timstamp: long
  static String lineHumidity = "air_humidity,location=%s humidity=%f %d\n";
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

    for (int i = 0; i < 5; i++) {
      timestampStart = timestamp;
      getConfig(1);
      createAQI();
      createTemperature();
      createHumidity();

      timestampStart += 7200;
      getConfig(2);
      createAQI();
      createTemperature();
      createHumidity();

      timestampStart += 10800;
      getConfig(3);
      createAQI();
      createTemperature();
      createHumidity();

      timestamp += 86400;
    }

    System.out.println("Done!");
  }

  public static void init() {
    try {
      FileWriter fileWriter = new FileWriter(file, true);
      PrintWriter printWriter = new PrintWriter(fileWriter);

      // printWriter.print("# DDL\n\nCREATE DATABASE AirNow_database\n\n# DML\n\n# CONTEXT-DATABASE: AirNow_database\n\n");
      printWriter.print("# DDL\n\n# DML\n\n# CONTEXT-DATABASE: AirNow_database\n\n");

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
      float currentPollutant;

      if (linear == 1) {
        currentPollutant = minPollutant;
      } else {
        currentPollutant = maxPollutant;
      }

      for (int i = 0; i < numberOfRecord; i++) {
        pollutant = rand.nextFloat() * (maxPollutant - minPollutant) + minPollutant;
        aqi = ugm3_aqi(pollutant);
        descript = getDescription(aqi);
        line = String.format(lineAqi, location, pollutant, aqi, descript, timestamp);

        printWriter.print(line);
        currentPollutant = pollutant;
        timestamp += timeStep;
      }

      fileWriter.flush();
      fileWriter.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public static int ugm3_aqi(float concentration_ugm3) {
    for (int i = 0; i < AQI_LEVELS; i++) {
      if (concentration_ugm3 >= pm25aqi[i].clow && concentration_ugm3 <= pm25aqi[i].chigh) {
        int result = (int)(((pm25aqi[i].lhigh - pm25aqi[i].llow) /
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
      float temp;
      float currentTemp;

      if (linear == 1) {
        currentTemp = minTemp;
      } else {
        currentTemp = maxTemp;
      }

      for (int i = 0; i < numberOfRecord; i++) {
        temp = rand.nextFloat() * (mmaxTemp - mminTemp) * linear + currentTemp;
        line = String.format(lineTemperature, location, temp, timestamp);

        printWriter.print(line);
        timestamp += timeStep;
        currentTemp = temp;
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
      float humi;
      float currentHumi;

      if (linear == 1) {
        currentHumi = maxHumi;
      } else {
        currentHumi = minHumi;
      }

      for (int i = 0; i < numberOfRecord; i++) {
        humi = rand.nextFloat() * (mmaxHumi - mminHumi) * (-1 * linear)+ currentHumi;
        line = String.format(lineHumidity, location, humi, timestamp);

        printWriter.print(line);
        timestamp += timeStep;
        currentHumi = humi;
      }

      fileWriter.flush();
      fileWriter.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public static void getConfig(int number) {
    switch (number) {
      case 1: { // 12h-14h
        numberOfRecord = 6;
        minTemp = 29.9f;
        maxTemp = 32.8f;
        mmaxTemp = 0.5f;
        mminTemp = 0.3f;
        minHumi = 40.4f;
        maxHumi = 46.5f;
        mmaxHumi = 1.9f;
        mminHumi= 0.9f;
        linear = 1; // inc temperature - des humidity
        minPollutant = 26.8f;
        maxPollutant = 43.2f;
        mmaxPollutant = 3.5f;
        mminPollutant = 1.5f;
        break;
      }

      case 2: { // 14h - 16h
        numberOfRecord = 6;
        minTemp = 29.8f;
        maxTemp = 32.5f;
        mminTemp = 0.6f;
        mmaxTemp = 0.9f;
        minHumi = 46.5f;
        maxHumi = 56.2f;
        mmaxHumi = 1.9f;
        mminHumi= 0.7f;
        linear = -1; // des temperature - inc humidity
        minPollutant = 9.3f;
        maxPollutant = 10.8f;
        mmaxPollutant = 3.2f;
        mminPollutant = 1.1f;
        break;
      }

      case 3: { // 19h - 23h
        numberOfRecord = 12;
        minTemp = 27.8f;
        maxTemp = 29.7f;
        mminTemp = 0.7f;
        mmaxTemp = 1.1f;
        minHumi = 52.2f;
        maxHumi = 62.1f;
        mmaxHumi = 1.6f;
        mminHumi= 0.9f;
        linear = -1; // des temperature - inc humidity
        minPollutant = 5.7f;
        maxPollutant = 8.8f;
        mmaxPollutant = 1.9f;
        mminPollutant = 1.3f;
      }
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