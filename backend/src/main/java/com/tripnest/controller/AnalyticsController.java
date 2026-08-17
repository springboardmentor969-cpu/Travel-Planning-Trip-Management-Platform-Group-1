package com.tripnest.controller;

import com.tripnest.dto.AdminAnalyticsDto;
import com.tripnest.dto.UserAnalyticsDto;
import com.tripnest.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;
    public AnalyticsController(AnalyticsService analyticsService) { this.analyticsService = analyticsService; }

    @GetMapping
    public ResponseEntity<UserAnalyticsDto> userAnalytics() { return ResponseEntity.ok(analyticsService.getUserAnalytics()); }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminAnalyticsDto> adminAnalytics() { return ResponseEntity.ok(analyticsService.getAdminAnalytics()); }
}
