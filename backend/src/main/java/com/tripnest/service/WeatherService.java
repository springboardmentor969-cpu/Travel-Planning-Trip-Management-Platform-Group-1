package com.tripnest.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripnest.config.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
public class WeatherService {

    private static final Logger logger = LoggerFactory.getLogger(WeatherService.class);
    private final AppProperties appProperties;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public WeatherService(AppProperties appProperties) {
        this.appProperties = appProperties;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public Map<String, Object> getWeatherForDestination(String cityName, Double lat, Double lon) {
        String apiKey = appProperties.getOpenweather().getApiKey();

        if (StringUtils.hasText(apiKey)) {
            try {
                String url;
                if (lat != null && lon != null) {
                    url = String.format("https://api.openweathermap.org/data/2.5/weather?lat=%f&lon=%f&units=metric&appid=%s", lat, lon, apiKey);
                } else {
                    url = String.format("https://api.openweathermap.org/data/2.5/weather?q=%s&units=metric&appid=%s", cityName, apiKey);
                }

                String response = restTemplate.getForObject(url, String.class);
                JsonNode root = objectMapper.readTree(response);

                Map<String, Object> result = new HashMap<>();
                result.put("city", root.path("name").asText(cityName));
                result.put("temp", root.path("main").path("temp").asDouble());
                result.put("feelsLike", root.path("main").path("feels_like").asDouble());
                result.put("humidity", root.path("main").path("humidity").asInt());
                result.put("windSpeed", root.path("wind").path("speed").asDouble());

                JsonNode weatherArr = root.path("weather");
                if (weatherArr.isArray() && weatherArr.size() > 0) {
                    result.put("condition", weatherArr.get(0).path("main").asText("Clear"));
                    result.put("description", weatherArr.get(0).path("description").asText("clear sky"));
                    result.put("icon", weatherArr.get(0).path("icon").asText("01d"));
                }

                result.put("forecast", generateDailyForecast(root.path("main").path("temp").asDouble()));
                result.put("isLive", true);
                return result;
            } catch (Exception e) {
                logger.warn("OpenWeather API error (using mock fallback): {}", e.getMessage());
            }
        }

        // Mock fallback with realistic weather data
        return generateMockWeather(cityName);
    }

    private Map<String, Object> generateMockWeather(String cityName) {
        Map<String, Object> result = new HashMap<>();
        Random random = new Random(cityName != null ? cityName.hashCode() : 42);

        int baseTemp = 18 + random.nextInt(12);
        String[] conditions = {"Sunny", "Partly Cloudy", "Mild Breezy", "Clear Sky", "Pleasant Warmth"};
        String[] icons = {"01d", "02d", "03d", "04d"};
        int conditionIdx = Math.abs(random.nextInt(conditions.length));

        result.put("city", cityName != null ? cityName : "Destination");
        result.put("temp", (double) baseTemp);
        result.put("feelsLike", (double) (baseTemp + 1));
        result.put("humidity", 45 + random.nextInt(30));
        result.put("windSpeed", 8 + random.nextInt(12));
        result.put("condition", conditions[conditionIdx]);
        result.put("description", "Ideal conditions for sightseeing and exploration");
        result.put("icon", icons[conditionIdx % icons.length]);
        result.put("forecast", generateDailyForecast((double) baseTemp));
        result.put("isLive", false);
        return result;
    }

    private List<Map<String, Object>> generateDailyForecast(double currentTemp) {
        List<Map<String, Object>> forecast = new ArrayList<>();
        LocalDate today = LocalDate.now();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};

        for (int i = 0; i < 5; i++) {
            LocalDate date = today.plusDays(i);
            Map<String, Object> dayMap = new HashMap<>();
            dayMap.put("date", date.toString());
            dayMap.put("dayOfWeek", days[date.getDayOfWeek().getValue() - 1]);
            dayMap.put("highTemp", Math.round(currentTemp + (i % 2 == 0 ? 2 : -1)));
            dayMap.put("lowTemp", Math.round(currentTemp - 5 - (i % 2)));
            dayMap.put("condition", i % 3 == 0 ? "Sunny" : (i % 3 == 1 ? "Partly Cloudy" : "Clear"));
            forecast.add(dayMap);
        }
        return forecast;
    }
}
