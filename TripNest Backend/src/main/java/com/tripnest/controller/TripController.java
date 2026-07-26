package com.tripnest.controller;

import com.tripnest.dto.TripRequest;
import com.tripnest.dto.TripResponse;
import com.tripnest.entity.TripStatus;
import com.tripnest.security.CustomUserPrincipal;
import com.tripnest.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    // GET /api/trips?status=&search=
    @GetMapping
    public ResponseEntity<List<TripResponse>> getTrips(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @RequestParam(required = false) TripStatus status,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(tripService.getTrips(principal.getId(), status, search));
    }

    // GET /api/trips/:id
    @GetMapping("/{tripId}")
    public ResponseEntity<TripResponse> getTripById(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId
    ) {
        return ResponseEntity.ok(tripService.getTripById(principal.getId(), tripId));
    }

    // POST /api/trips
    @PostMapping
    public ResponseEntity<TripResponse> createTrip(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @Valid @RequestBody TripRequest request
    ) {
        TripResponse response = tripService.createTrip(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // PUT /api/trips/:id
    @PutMapping("/{tripId}")
    public ResponseEntity<TripResponse> updateTrip(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @Valid @RequestBody TripRequest request
    ) {
        return ResponseEntity.ok(tripService.updateTrip(principal.getId(), tripId, request));
    }

    // DELETE /api/trips/:id
    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> deleteTrip(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId
    ) {
        tripService.deleteTrip(principal.getId(), tripId);
        return ResponseEntity.noContent().build();
    }
}