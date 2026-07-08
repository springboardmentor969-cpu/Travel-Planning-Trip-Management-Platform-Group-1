package com.tripnest.controller;

import com.tripnest.dto.DashboardDto;
import com.tripnest.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<DashboardDto> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboard());
    }
}
