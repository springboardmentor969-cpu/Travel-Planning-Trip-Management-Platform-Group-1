package com.travelplanner.controller;

import com.travelplanner.entity.Expense;
import com.travelplanner.entity.Trip;
import com.travelplanner.repository.ExpenseRepository;
import com.travelplanner.repository.TripRepository;
import com.travelplanner.security.UserDetailsImpl;
import com.travelplanner.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.travelplanner.repository.BudgetRepository;
import com.travelplanner.repository.NotificationRepository;
import com.travelplanner.service.EmailService;
import com.travelplanner.entity.Budget;
import com.travelplanner.entity.Notification;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<?> getExpensesByTripId(@PathVariable Long tripId) {
        Trip trip = tripRepository.findById(tripId).orElse(null);
        if (trip == null) {
            return ResponseEntity.notFound().build();
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        boolean isOwner = trip.getUser().getId().equals(userDetails.getId());
        boolean isCollaborator = trip.getCollaborators().stream().anyMatch(c -> c.getId().equals(userDetails.getId()));
        if (!isOwner && !isCollaborator) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: Unauthorized access."));
        }

        List<Expense> expenses = expenseRepository.findByTripId(tripId);
        return ResponseEntity.ok(expenses);
    }

    @PostMapping("/trip/{tripId}")
    public ResponseEntity<?> createExpense(@PathVariable Long tripId, @RequestBody Expense expenseRequest) {
        Trip trip = tripRepository.findById(tripId).orElse(null);
        if (trip == null) {
            return ResponseEntity.notFound().build();
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        boolean isOwner = trip.getUser().getId().equals(userDetails.getId());
        boolean isCollaborator = trip.getCollaborators().stream().anyMatch(c -> c.getId().equals(userDetails.getId()));
        if (!isOwner && !isCollaborator) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: Unauthorized access."));
        }

        Expense expense = new Expense();
        expense.setTrip(trip);
        expense.setAmount(expenseRequest.getAmount());
        expense.setCategory(expenseRequest.getCategory());
        expense.setDescription(expenseRequest.getDescription());
        expense.setExpenseDate(expenseRequest.getExpenseDate());

        Expense savedExpense = expenseRepository.save(expense);

        // Check if budget is exceeded or close to threshold (90%+)
        try {
            List<Expense> allExpenses = expenseRepository.findByTripId(tripId);
            java.math.BigDecimal totalSpent = allExpenses.stream()
                .map(Expense::getAmount)
                .filter(java.util.Objects::nonNull)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
            
            Budget budget = budgetRepository.findByTripId(tripId).orElse(null);
            if (budget != null && budget.getTotalLimit() != null && budget.getTotalLimit().compareTo(java.math.BigDecimal.ZERO) > 0) {
                java.math.BigDecimal threshold = budget.getTotalLimit().multiply(new java.math.BigDecimal("0.9"));
                if (totalSpent.compareTo(threshold) >= 0) {
                    emailService.sendBudgetAlert(trip.getUser().getEmail(), trip.getTitle(), totalSpent.doubleValue(), budget.getTotalLimit().doubleValue());
                    
                    // Log DB notification & push real-time SSE alert
                    Notification notification = new Notification();
                    notification.setUser(trip.getUser());
                    notification.setMessage("⚠️ Trip \"" + trip.getTitle() + "\" budget threshold crossed! Spent " + totalSpent + " of " + budget.getTotalLimit());
                    notification.setIsRead(false);
                    notificationRepository.save(notification);
                    NotificationController.pushAlert(trip.getUser().getId(), notification.getMessage());
                }
            }
        } catch (Exception e) {
            System.out.println("Budget threshold notification check failed: " + e.getMessage());
        }

        return ResponseEntity.ok(savedExpense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        Expense expense = expenseRepository.findById(id).orElse(null);
        if (expense == null) {
            return ResponseEntity.notFound().build();
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Trip trip = expense.getTrip();
        boolean isOwner = trip.getUser().getId().equals(userDetails.getId());
        boolean isCollaborator = trip.getCollaborators().stream().anyMatch(c -> c.getId().equals(userDetails.getId()));
        if (!isOwner && !isCollaborator) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: Unauthorized access."));
        }

        expenseRepository.delete(expense);
        return ResponseEntity.ok(new MessageResponse("Expense deleted successfully!"));
    }
}
