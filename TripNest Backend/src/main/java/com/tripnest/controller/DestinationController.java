package com.tripnest.controller;

import com.tripnest.dto.AttractionResponse;
import com.tripnest.dto.DestinationResponse;
import com.tripnest.dto.WeatherResponse;
import com.tripnest.security.CustomUserPrincipal;
import com.tripnest.service.DestinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Publicly browsable (see SecurityConfig: "/api/destinations/**" is permitAll),
// but still personalizes the "isFavorite" flag when a valid JWT is present.
@RestController
@RequestMapping("/api/destinations")
@RequiredArgsConstructor
public class DestinationController {

    private final DestinationService destinationService;

    // GET /api/destinations?search=
    @GetMapping
    public ResponseEntity<List<DestinationResponse>> getDestinations(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(destinationService.getDestinations(userId(principal), search));
    }

    // GET /api/destinations/popular
    @GetMapping("/popular")
    public ResponseEntity<List<DestinationResponse>> getPopularDestinations(
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        return ResponseEntity.ok(destinationService.getPopularDestinations(userId(principal)));
    }

    // GET /api/destinations/:destinationId
    @GetMapping("/{destinationId}")
    public ResponseEntity<DestinationResponse> getDestinationById(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long destinationId
    ) {
        return ResponseEntity.ok(destinationService.getDestinationById(userId(principal), destinationId));
    }

    // GET /api/destinations/:destinationId/attractions
    @GetMapping("/{destinationId}/attractions")
    public ResponseEntity<List<AttractionResponse>> getAttractions(@PathVariable Long destinationId) {
        return ResponseEntity.ok(destinationService.getAttractions(destinationId));
    }

    // GET /api/destinations/:destinationId/weather
    @GetMapping("/{destinationId}/weather")
    public ResponseEntity<WeatherResponse> getWeather(@PathVariable Long destinationId) {
        return ResponseEntity.ok(destinationService.getWeather(destinationId));
    }

    private Long userId(CustomUserPrincipal principal) {
        return principal != null ? principal.getId() : null;
    }
}