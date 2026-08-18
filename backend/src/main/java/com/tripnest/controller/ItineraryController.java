package com.tripnest.controller;

import com.tripnest.dto.ApiResponse;
import com.tripnest.dto.ItineraryDTO;
import com.tripnest.entity.User;
import com.tripnest.service.ItineraryService;
import com.tripnest.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/itineraries")
public class ItineraryController {

    private final ItineraryService itineraryService;
    private final UserService userService;

    public ItineraryController(ItineraryService itineraryService, UserService userService) {
        this.itineraryService = itineraryService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ItineraryDTO>>> getItineraries(@PathVariable Long tripId) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        List<ItineraryDTO> list = itineraryService.getItinerariesByTrip(tripId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Itinerary retrieved successfully", list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ItineraryDTO>> addItineraryDay(
            @PathVariable Long tripId,
            @Valid @RequestBody ItineraryDTO dto) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        ItineraryDTO created = itineraryService.addItineraryDay(tripId, dto, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Itinerary day added successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ItineraryDTO>> updateItineraryDay(
            @PathVariable Long tripId,
            @PathVariable Long id,
            @Valid @RequestBody ItineraryDTO dto) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        ItineraryDTO updated = itineraryService.updateItineraryDay(id, dto, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Itinerary day updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteItineraryDay(
            @PathVariable Long tripId,
            @PathVariable Long id) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        itineraryService.deleteItineraryDay(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Itinerary day deleted successfully"));
    }
}
