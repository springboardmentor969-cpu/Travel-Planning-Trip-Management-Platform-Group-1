package com.tripnest.controller;

import com.tripnest.dto.*;
import com.tripnest.service.ItineraryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips/{tripId}/itinerary")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;

    @PostMapping
    public ResponseEntity<ActivityResponse> addActivity(Authentication auth, @PathVariable Long tripId,
                                                          @Valid @RequestBody CreateActivityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(itineraryService.addActivity(auth.getName(), tripId, request));
    }

    @GetMapping
    public ResponseEntity<List<DayItinerary>> getItinerary(Authentication auth, @PathVariable Long tripId) {
        return ResponseEntity.ok(itineraryService.getItinerary(auth.getName(), tripId));
    }

    @GetMapping("/day/{dayNumber}")
    public ResponseEntity<List<ActivityResponse>> getDay(Authentication auth, @PathVariable Long tripId,
                                                          @PathVariable Integer dayNumber) {
        return ResponseEntity.ok(itineraryService.getDayActivities(auth.getName(), tripId, dayNumber));
    }

    @PutMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> updateActivity(Authentication auth, @PathVariable Long tripId,
                                                            @PathVariable Long activityId,
                                                            @RequestBody UpdateActivityRequest request) {
        return ResponseEntity.ok(itineraryService.updateActivity(auth.getName(), tripId, activityId, request));
    }

    @DeleteMapping("/{activityId}")
    public ResponseEntity<Map<String, String>> deleteActivity(Authentication auth, @PathVariable Long tripId,
                                                                @PathVariable Long activityId) {
        itineraryService.deleteActivity(auth.getName(), tripId, activityId);
        return ResponseEntity.ok(Map.of("message", "Activity deleted"));
    }
}
