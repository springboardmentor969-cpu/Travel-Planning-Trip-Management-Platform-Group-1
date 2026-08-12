package com.tripnest.service;

import com.tripnest.dto.BudgetSummaryDto;
import com.tripnest.entity.Trip;
import com.tripnest.repository.ExpenseRepository;
import com.tripnest.repository.TripRepository;
import java.math.BigDecimal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class BudgetService {
    private final TripRepository tripRepository;
    private final ExpenseRepository expenseRepository;
    private final UserService userService;

    public BudgetService(TripRepository tripRepository, ExpenseRepository expenseRepository, UserService userService) {
        this.tripRepository = tripRepository;
        this.expenseRepository = expenseRepository;
        this.userService = userService;
    }

    public BudgetSummaryDto getSummary(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new com.tripnest.exception.ResourceNotFoundException("Trip not found with id " + tripId));
        boolean owner = trip.getUser().getId().equals(userService.getCurrentUser().getId());
        boolean collaborator = trip.getCollaborators().stream()
            .anyMatch(user -> user.getId().equals(userService.getCurrentUser().getId()));
        if (!owner && !collaborator) {
            throw new com.tripnest.exception.ResourceNotFoundException("Trip not found with id " + tripId);
        }
        BigDecimal totalExpenses = expenseRepository.sumAmountByTripId(tripId);
        return new BudgetSummaryDto(
                trip.getId(),
                trip.getTitle(),
                trip.getBudget(),
                totalExpenses,
                trip.getBudget().subtract(totalExpenses)
        );
    }
}
