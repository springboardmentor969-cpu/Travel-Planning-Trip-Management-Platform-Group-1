package com.tripnest.controller;

import com.tripnest.dto.AdminAnalyticsDTO;
import com.tripnest.dto.ApiResponse;
import com.tripnest.dto.TripDTO;
import com.tripnest.dto.UserProfileDTO;
import com.tripnest.entity.Role;
import com.tripnest.entity.User;
import com.tripnest.repository.TripRepository;
import com.tripnest.service.AnalyticsService;
import com.tripnest.service.TripService;
import com.tripnest.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AnalyticsService analyticsService;
    private final UserService userService;
    private final TripService tripService;
    private final TripRepository tripRepository;

    public AdminController(AnalyticsService analyticsService,
                           UserService userService,
                           TripService tripService,
                           TripRepository tripRepository) {
        this.analyticsService = analyticsService;
        this.userService = userService;
        this.tripService = tripService;
        this.tripRepository = tripRepository;
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AdminAnalyticsDTO>> getAdminAnalytics() {
        AdminAnalyticsDTO analytics = analyticsService.getAdminAnalytics();
        return ResponseEntity.ok(ApiResponse.success("Admin analytics retrieved successfully", analytics));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserProfileDTO>>> getAllUsers() {
        List<UserProfileDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        String roleStr = request.get("role");
        Role role = Role.valueOf(roleStr);
        UserProfileDTO updated = userService.updateUserRole(userId, role);
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", updated));
    }

    @PutMapping("/users/{userId}/toggle-status")
    public ResponseEntity<ApiResponse<UserProfileDTO>> toggleUserStatus(@PathVariable Long userId) {
        UserProfileDTO updated = userService.toggleUserStatus(userId);
        return ResponseEntity.ok(ApiResponse.success("User status toggled successfully", updated));
    }

    @GetMapping("/trips")
    public ResponseEntity<ApiResponse<List<TripDTO>>> getAllTrips() {
        List<TripDTO> trips = tripRepository.findAll().stream()
                .map(t -> tripService.mapToDTO(t, false))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("All platform trips retrieved", trips));
    }

    @DeleteMapping("/trips/{tripId}")
    public ResponseEntity<ApiResponse<Void>> deleteTrip(@PathVariable Long tripId) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        tripService.deleteTrip(tripId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Trip removed by administrator"));
    }
}
