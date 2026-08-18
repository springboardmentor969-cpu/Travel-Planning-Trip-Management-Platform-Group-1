package com.tripnest.controller;

import com.tripnest.dto.ApiResponse;
import com.tripnest.dto.BudgetDTO;
import com.tripnest.entity.User;
import com.tripnest.service.BudgetService;
import com.tripnest.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips/{tripId}/budget")
public class BudgetController {

    private final BudgetService budgetService;
    private final UserService userService;

    public BudgetController(BudgetService budgetService, UserService userService) {
        this.budgetService = budgetService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<BudgetDTO>> getTripBudget(@PathVariable Long tripId) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        BudgetDTO budget = budgetService.getTripBudget(tripId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Budget retrieved successfully", budget));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<BudgetDTO>> updateTripBudget(
            @PathVariable Long tripId,
            @Valid @RequestBody BudgetDTO dto) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        BudgetDTO updated = budgetService.updateTripBudget(tripId, dto, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Budget updated successfully", updated));
    }
}
