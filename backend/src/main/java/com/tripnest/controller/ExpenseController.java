package com.tripnest.controller;

import com.tripnest.dto.ExpenseDto;
import com.tripnest.service.ExpenseService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trips/{tripId}/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ExpenseDto> create(@PathVariable Long tripId, @Valid @RequestBody ExpenseDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.create(tripId, dto));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDto>> list(@PathVariable Long tripId) {
        return ResponseEntity.ok(expenseService.list(tripId));
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ExpenseDto> update(
            @PathVariable Long tripId,
            @PathVariable Long expenseId,
            @Valid @RequestBody ExpenseDto dto
    ) {
        return ResponseEntity.ok(expenseService.update(tripId, expenseId, dto));
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> delete(@PathVariable Long tripId, @PathVariable Long expenseId) {
        expenseService.delete(tripId, expenseId);
        return ResponseEntity.noContent().build();
    }
}
