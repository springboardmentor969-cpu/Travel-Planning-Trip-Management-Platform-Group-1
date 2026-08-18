package com.tripnest.controller;

import com.tripnest.dto.ApiResponse;
import com.tripnest.dto.TravelerAnalyticsDTO;
import com.tripnest.entity.User;
import com.tripnest.service.AnalyticsService;
import com.tripnest.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final UserService userService;

    public AnalyticsController(AnalyticsService analyticsService, UserService userService) {
        this.analyticsService = analyticsService;
        this.userService = userService;
    }

    @GetMapping("/traveler")
    public ResponseEntity<ApiResponse<TravelerAnalyticsDTO>> getTravelerAnalytics() {
        User currentUser = userService.getCurrentAuthenticatedUser();
        TravelerAnalyticsDTO stats = analyticsService.getTravelerAnalytics(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Traveler analytics retrieved successfully", stats));
    }
}
