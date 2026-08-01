package com.travelplanner.controller;

import com.travelplanner.entity.Budget;
import com.travelplanner.entity.Trip;
import com.travelplanner.repository.BudgetRepository;
import com.travelplanner.repository.TripRepository;
import com.travelplanner.security.UserDetailsImpl;
import com.travelplanner.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private TripRepository tripRepository;

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<?> getBudgetByTripId(@PathVariable Long tripId) {
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
                    .body(new MessageResponse("Error: Unauthorized access to this trip."));
        }

        Budget budget = budgetRepository.findByTripId(tripId).orElse(null);
        if (budget == null) {
            // Return a default mock budget if none has been saved yet
            Budget defaultBudget = new Budget();
            defaultBudget.setTotalLimit(new BigDecimal("85000.00"));
            defaultBudget.setCurrency("INR");
            defaultBudget.setTrip(trip);
            return ResponseEntity.ok(defaultBudget);
        }
        return ResponseEntity.ok(budget);
    }

    @PostMapping("/trip/{tripId}")
    public ResponseEntity<?> setBudget(@PathVariable Long tripId, @RequestBody Budget budgetRequest) {
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

        Budget budget = budgetRepository.findByTripId(tripId).orElse(new Budget());
        budget.setTrip(trip);
        budget.setTotalLimit(budgetRequest.getTotalLimit() != null ? budgetRequest.getTotalLimit() : new BigDecimal("85000.00"));
        budget.setCurrency(budgetRequest.getCurrency() != null ? budgetRequest.getCurrency() : "INR");

        Budget savedBudget = budgetRepository.save(budget);
        return ResponseEntity.ok(savedBudget);
    }
}
