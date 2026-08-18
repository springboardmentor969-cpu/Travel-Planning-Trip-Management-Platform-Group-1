package com.tripnest.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private final Jwt jwt = new Jwt();
    private final Cors cors = new Cors();
    private String uploadDir = "./uploads";
    private final Openweather openweather = new Openweather();
    private final Googlemaps googlemaps = new Googlemaps();

    public static class Jwt {
        private String secret = "9a6747f3a18e00d92e884e4935728f2e6315747b887e323a0e161b9a0c16b7202d81cf8b02e7970f609b664f9746b140";
        private long expirationMs = 86400000; // 24 hours

        public String getSecret() { return secret; }
        public void setSecret(String secret) { this.secret = secret; }
        public long getExpirationMs() { return expirationMs; }
        public void setExpirationMs(long expirationMs) { this.expirationMs = expirationMs; }
    }

    public static class Cors {
        private List<String> allowedOrigins = new ArrayList<>(List.of("http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"));

        public List<String> getAllowedOrigins() { return allowedOrigins; }
        public void setAllowedOrigins(List<String> allowedOrigins) { this.allowedOrigins = allowedOrigins; }
    }

    public static class Openweather {
        private String apiKey = "";
        public String getApiKey() { return apiKey; }
        public void setApiKey(String apiKey) { this.apiKey = apiKey; }
    }

    public static class Googlemaps {
        private String apiKey = "";
        public String getApiKey() { return apiKey; }
        public void setApiKey(String apiKey) { this.apiKey = apiKey; }
    }

    public Jwt getJwt() { return jwt; }
    public Cors getCors() { return cors; }
    public String getUploadDir() { return uploadDir; }
    public void setUploadDir(String uploadDir) { this.uploadDir = uploadDir; }
    public Openweather getOpenweather() { return openweather; }
    public Googlemaps getGooglemaps() { return googlemaps; }
}
