package com.tripnest.controller;

import com.tripnest.dto.ActivityRequest;
import com.tripnest.dto.ActivityResponse;
import com.tripnest.dto.ItineraryDayRequest;
import com.tripnest.dto.ItineraryDayResponse;
import com.tripnest.dto.ReorderRequest;
import com.tripnest.security.CustomUserPrincipal;
import com.tripnest.service.ItineraryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/itinerary")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;

    // GET /api/trips/:tripId/itinerary
    @GetMapping
    public ResponseEntity<List<ItineraryDayResponse>> getItinerary(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId
    ) {
        return ResponseEntity.ok(itineraryService.getItinerary(principal.getId(), tripId));
    }

    // POST /api/trips/:tripId/itinerary/days
    @PostMapping("/days")
    public ResponseEntity<ItineraryDayResponse> addDay(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @Valid @RequestBody ItineraryDayRequest request
    ) {
        ItineraryDayResponse response = itineraryService.addDay(principal.getId(), tripId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // DELETE /api/trips/:tripId/itinerary/days/:dayId
    @DeleteMapping("/days/{dayId}")
    public ResponseEntity<Void> removeDay(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @PathVariable Long dayId
    ) {
        itineraryService.removeDay(principal.getId(), tripId, dayId);
        return ResponseEntity.noContent().build();
    }

    // POST /api/trips/:tripId/itinerary/days/:dayId/activities
    @PostMapping("/days/{dayId}/activities")
    public ResponseEntity<ActivityResponse> addActivity(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @PathVariable Long dayId,
            @Valid @RequestBody ActivityRequest request
    ) {
        ActivityResponse response = itineraryService.addActivity(principal.getId(), tripId, dayId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // PUT /api/trips/:tripId/itinerary/activities/:activityId
    @PutMapping("/activities/{activityId}")
    public ResponseEntity<ActivityResponse> updateActivity(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @PathVariable Long activityId,
            @Valid @RequestBody ActivityRequest request
    ) {
        return ResponseEntity.ok(itineraryService.updateActivity(principal.getId(), tripId, activityId, request));
    }

    // DELETE /api/trips/:tripId/itinerary/activities/:activityId
    @DeleteMapping("/activities/{activityId}")
    public ResponseEntity<Void> deleteActivity(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @PathVariable Long activityId
    ) {
        itineraryService.deleteActivity(principal.getId(), tripId, activityId);
        return ResponseEntity.noContent().build();
    }

    // PATCH /api/trips/:tripId/itinerary/activities/:activityId/reorder
    @PatchMapping("/activities/{activityId}/reorder")
    public ResponseEntity<ActivityResponse> reorderActivity(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @PathVariable Long activityId,
            @Valid @RequestBody ReorderRequest request
    ) {
        return ResponseEntity.ok(itineraryService.reorderActivity(principal.getId(), tripId, activityId, request));
    }
}