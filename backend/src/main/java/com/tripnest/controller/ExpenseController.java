package com.tripnest.controller;

import com.tripnest.dto.ApiResponse;
import com.tripnest.dto.ExpenseDTO;
import com.tripnest.entity.User;
import com.tripnest.service.ExpenseService;
import com.tripnest.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserService userService;

    public ExpenseController(ExpenseService expenseService, UserService userService) {
        this.expenseService = expenseService;
        this.userService = userService;
    }

    @PostMapping("/trips/{tripId}/expenses")
    public ResponseEntity<ApiResponse<ExpenseDTO>> addExpense(
            @PathVariable Long tripId,
            @Valid @RequestBody ExpenseDTO dto) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        ExpenseDTO created = expenseService.addExpense(tripId, dto, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Expense added successfully", created));
    }

    @GetMapping("/trips/{tripId}/expenses")
    public ResponseEntity<ApiResponse<List<ExpenseDTO>>> getExpensesByTrip(@PathVariable Long tripId) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        List<ExpenseDTO> expenses = expenseService.getExpensesByTrip(tripId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Expenses retrieved successfully", expenses));
    }

    @GetMapping("/trips/{tripId}/expenses/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getExpenseSummary(@PathVariable Long tripId) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        Map<String, Object> summary = expenseService.getExpenseSummary(tripId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Expense summary retrieved successfully", summary));
    }

    @PutMapping("/expenses/{id}")
    public ResponseEntity<ApiResponse<ExpenseDTO>> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseDTO dto) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        ExpenseDTO updated = expenseService.updateExpense(id, dto, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Expense updated successfully", updated));
    }

    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable Long id) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        expenseService.deleteExpense(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted successfully"));
    }
}
