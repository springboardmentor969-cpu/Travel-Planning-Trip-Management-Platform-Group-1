package com.tripnest.controller;

import com.tripnest.dto.BudgetResponse;
import com.tripnest.dto.ExpenseRequest;
import com.tripnest.dto.ExpenseResponse;
import com.tripnest.security.CustomUserPrincipal;
import com.tripnest.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips/{tripId}")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    // GET /api/trips/:tripId/budget
    @GetMapping("/budget")
    public ResponseEntity<BudgetResponse> getBudget(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId
    ) {
        return ResponseEntity.ok(budgetService.getBudget(principal.getId(), tripId));
    }

    // PUT /api/trips/:tripId/budget
    @PutMapping("/budget")
    public ResponseEntity<BudgetResponse> updateBudget(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @RequestBody Map<String, Double> payload
    ) {
        Double budget = payload.get("budget");
        return ResponseEntity.ok(budgetService.updateBudget(principal.getId(), tripId, budget));
    }

    // GET /api/trips/:tripId/expenses
    @GetMapping("/expenses")
    public ResponseEntity<List<ExpenseResponse>> getExpenses(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId
    ) {
        return ResponseEntity.ok(budgetService.getExpenses(principal.getId(), tripId));
    }

    // POST /api/trips/:tripId/expenses
    @PostMapping("/expenses")
    public ResponseEntity<ExpenseResponse> addExpense(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @Valid @RequestBody ExpenseRequest request
    ) {
        ExpenseResponse response = budgetService.addExpense(principal.getId(), tripId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // PUT /api/trips/:tripId/expenses/:expenseId
    @PutMapping("/expenses/{expenseId}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @PathVariable Long expenseId,
            @Valid @RequestBody ExpenseRequest request
    ) {
        return ResponseEntity.ok(budgetService.updateExpense(principal.getId(), tripId, expenseId, request));
    }

    // DELETE /api/trips/:tripId/expenses/:expenseId
    @DeleteMapping("/expenses/{expenseId}")
    public ResponseEntity<Void> deleteExpense(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @PathVariable Long expenseId
    ) {
        budgetService.deleteExpense(principal.getId(), tripId, expenseId);
        return ResponseEntity.noContent().build();
    }

    // POST /api/trips/:tripId/expenses/:expenseId/receipt
    @PostMapping("/expenses/{expenseId}/receipt")
    public ResponseEntity<ExpenseResponse> uploadReceipt(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @PathVariable Long expenseId,
            @RequestParam("file") MultipartFile file
    ) {
        String mockUrl = "/uploads/receipts/" + (file.getOriginalFilename() != null ? file.getOriginalFilename() : "receipt.png");
        return ResponseEntity.ok(budgetService.uploadReceipt(principal.getId(), tripId, expenseId, mockUrl));
    }

    // GET /api/trips/:tripId/expenses/report
    @GetMapping("/expenses/report")
    public ResponseEntity<BudgetResponse> getExpenseReport(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId
    ) {
        return ResponseEntity.ok(budgetService.getBudget(principal.getId(), tripId));
    }
}
