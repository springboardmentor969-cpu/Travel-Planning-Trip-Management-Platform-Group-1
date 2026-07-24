package com.tripnest.controller;

import com.tripnest.dto.*;
import com.tripnest.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(Authentication auth, @Valid @RequestBody CreateTripRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tripService.createTrip(auth.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<TripResponse>> getMyTrips(Authentication auth) {
        return ResponseEntity.ok(tripService.getMyTrips(auth.getName()));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<TripResponse> getTrip(Authentication auth, @PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.getTripById(auth.getName(), tripId));
    }

    @PutMapping("/{tripId}")
    public ResponseEntity<TripResponse> updateTrip(Authentication auth, @PathVariable Long tripId,
                                                    @RequestBody UpdateTripRequest request) {
        return ResponseEntity.ok(tripService.updateTrip(auth.getName(), tripId, request));
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<Map<String, String>> deleteTrip(Authentication auth, @PathVariable Long tripId) {
        tripService.deleteTrip(auth.getName(), tripId);
        return ResponseEntity.ok(Map.of("message", "Trip deleted"));
    }

    @PostMapping("/{tripId}/share")
    public ResponseEntity<TripResponse> shareTrip(Authentication auth, @PathVariable Long tripId,
                                                   @Valid @RequestBody ShareTripRequest request) {
        return ResponseEntity.ok(tripService.shareTrip(auth.getName(), tripId, request));
    }

    @DeleteMapping("/{tripId}/collaborators/{collaboratorUserId}")
    public ResponseEntity<TripResponse> removeCollaborator(Authentication auth, @PathVariable Long tripId,
                                                            @PathVariable Long collaboratorUserId) {
        return ResponseEntity.ok(tripService.removeCollaborator(auth.getName(), tripId, collaboratorUserId));
    }
}
