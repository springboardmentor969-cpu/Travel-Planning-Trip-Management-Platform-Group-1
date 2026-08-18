package com.tripnest.controller;

import com.tripnest.dto.ApiResponse;
import com.tripnest.dto.DestinationDTO;
import com.tripnest.service.DestinationService;
import com.tripnest.service.MapService;
import com.tripnest.service.WeatherService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService destinationService;
    private final WeatherService weatherService;
    private final MapService mapService;

    public DestinationController(DestinationService destinationService,
                                 WeatherService weatherService,
                                 MapService mapService) {
        this.destinationService = destinationService;
        this.weatherService = weatherService;
        this.mapService = mapService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DestinationDTO>>> getAllDestinations(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category) {
        List<DestinationDTO> destinations = destinationService.getAllDestinations(query, category);
        return ResponseEntity.ok(ApiResponse.success("Destinations retrieved successfully", destinations));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<DestinationDTO>>> getPopularDestinations() {
        List<DestinationDTO> destinations = destinationService.getPopularDestinations();
        return ResponseEntity.ok(ApiResponse.success("Popular destinations retrieved successfully", destinations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DestinationDTO>> getDestinationById(@PathVariable Long id) {
        DestinationDTO destination = destinationService.getDestinationById(id);
        return ResponseEntity.ok(ApiResponse.success("Destination details retrieved successfully", destination));
    }

    @GetMapping("/{id}/weather")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDestinationWeather(@PathVariable Long id) {
        DestinationDTO destination = destinationService.getDestinationById(id);
        Map<String, Object> weather = weatherService.getWeatherForDestination(
                destination.getCity() != null ? destination.getCity() : destination.getName(),
                destination.getLatitude(),
                destination.getLongitude()
        );
        return ResponseEntity.ok(ApiResponse.success("Weather retrieved successfully", weather));
    }

    @GetMapping("/{id}/map")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDestinationMapConfig(@PathVariable Long id) {
        DestinationDTO destination = destinationService.getDestinationById(id);
        Map<String, Object> mapConfig = mapService.getMapConfig(
                destination.getLatitude(),
                destination.getLongitude(),
                destination.getName()
        );
        return ResponseEntity.ok(ApiResponse.success("Map configuration retrieved successfully", mapConfig));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DestinationDTO>> createDestination(@Valid @RequestBody DestinationDTO dto) {
        DestinationDTO created = destinationService.createDestination(dto);
        return ResponseEntity.ok(ApiResponse.success("Destination created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DestinationDTO>> updateDestination(@PathVariable Long id, @Valid @RequestBody DestinationDTO dto) {
        DestinationDTO updated = destinationService.updateDestination(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Destination updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDestination(@PathVariable Long id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.ok(ApiResponse.success("Destination deleted successfully"));
    }
}
