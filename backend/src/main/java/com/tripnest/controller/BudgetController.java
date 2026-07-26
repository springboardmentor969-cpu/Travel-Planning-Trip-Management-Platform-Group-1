package com.tripnest.controller;

import com.tripnest.dto.BudgetSummaryDto;
import com.tripnest.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trips/{tripId}/budget")
public class BudgetController {
    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BudgetSummaryDto> getSummary(@PathVariable Long tripId) {
        return ResponseEntity.ok(budgetService.getSummary(tripId));
    }
}
