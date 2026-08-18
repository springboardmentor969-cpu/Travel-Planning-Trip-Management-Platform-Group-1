package com.tripnest.controller;

import com.tripnest.dto.ApiResponse;
import com.tripnest.dto.TripDTO;
import com.tripnest.entity.User;
import com.tripnest.service.TripService;
import com.tripnest.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;
    private final UserService userService;

    public TripController(TripService tripService, UserService userService) {
        this.tripService = tripService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TripDTO>> createTrip(@Valid @RequestBody TripDTO tripDTO) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        TripDTO created = tripService.createTrip(tripDTO, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Trip created successfully", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TripDTO>>> getUserTrips() {
        User currentUser = userService.getCurrentAuthenticatedUser();
        List<TripDTO> trips = tripService.getUserTrips(currentUser);
        return ResponseEntity.ok(ApiResponse.success("User trips retrieved successfully", trips));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TripDTO>> getTripById(@PathVariable Long id) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        TripDTO trip = tripService.getTripById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Trip details retrieved successfully", trip));
    }

    @GetMapping("/share/{shareCode}")
    public ResponseEntity<ApiResponse<TripDTO>> getTripByShareCode(@PathVariable String shareCode) {
        TripDTO trip = tripService.getTripByShareCode(shareCode);
        return ResponseEntity.ok(ApiResponse.success("Shared trip retrieved successfully", trip));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TripDTO>> updateTrip(@PathVariable Long id, @Valid @RequestBody TripDTO tripDTO) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        TripDTO updated = tripService.updateTrip(id, tripDTO, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Trip updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTrip(@PathVariable Long id) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        tripService.deleteTrip(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Trip deleted successfully"));
    }
}
