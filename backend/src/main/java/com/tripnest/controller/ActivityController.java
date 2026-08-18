package com.tripnest.controller;

import com.tripnest.dto.ActivityDTO;
import com.tripnest.dto.ApiResponse;
import com.tripnest.entity.User;
import com.tripnest.service.ActivityService;
import com.tripnest.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ActivityController {

    private final ActivityService activityService;
    private final UserService userService;

    public ActivityController(ActivityService activityService, UserService userService) {
        this.activityService = activityService;
        this.userService = userService;
    }

    @PostMapping("/itineraries/{itineraryId}/activities")
    public ResponseEntity<ApiResponse<ActivityDTO>> addActivity(
            @PathVariable Long itineraryId,
            @Valid @RequestBody ActivityDTO dto) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        ActivityDTO created = activityService.addActivity(itineraryId, dto, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Activity added successfully", created));
    }

    @PutMapping("/activities/{id}")
    public ResponseEntity<ApiResponse<ActivityDTO>> updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody ActivityDTO dto) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        ActivityDTO updated = activityService.updateActivity(id, dto, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Activity updated successfully", updated));
    }

    @DeleteMapping("/activities/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteActivity(@PathVariable Long id) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        activityService.deleteActivity(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Activity deleted successfully"));
    }

    @PutMapping("/itineraries/{itineraryId}/activities/reorder")
    public ResponseEntity<ApiResponse<Void>> reorderActivities(
            @PathVariable Long itineraryId,
            @RequestBody List<Long> activityIds) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        activityService.reorderActivities(itineraryId, activityIds, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Activities reordered successfully"));
    }
}
