package com.tripnest.service;

import com.tripnest.config.AppProperties;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;

@Service
public class MapService {

    private final AppProperties appProperties;

    public MapService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public Map<String, Object> getMapConfig(Double lat, Double lon, String destinationName) {
        Map<String, Object> mapConfig = new HashMap<>();
        String googleApiKey = appProperties.getGooglemaps().getApiKey();

        mapConfig.put("latitude", lat != null ? lat : 48.8566);
        mapConfig.put("longitude", lon != null ? lon : 2.3522);
        mapConfig.put("destinationName", destinationName != null ? destinationName : "Destination");
        mapConfig.put("hasGoogleMapsKey", StringUtils.hasText(googleApiKey));
        mapConfig.put("googleMapsKey", googleApiKey);
        mapConfig.put("tileProvider", "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");

        return mapConfig;
    }
}
