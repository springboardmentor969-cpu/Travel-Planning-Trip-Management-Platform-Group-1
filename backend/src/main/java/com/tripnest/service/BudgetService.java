package com.tripnest.service;

import com.tripnest.dto.BudgetDTO;
import com.tripnest.entity.Budget;
import com.tripnest.entity.Trip;
import com.tripnest.entity.User;
import com.tripnest.exception.ForbiddenException;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.repository.BudgetRepository;
import com.tripnest.repository.ExpenseRepository;
import com.tripnest.repository.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TripRepository tripRepository;
    private final ExpenseRepository expenseRepository;
    private final TripService tripService;
    private final NotificationService notificationService;

    public BudgetService(BudgetRepository budgetRepository,
                         TripRepository tripRepository,
                         ExpenseRepository expenseRepository,
                         TripService tripService,
                         NotificationService notificationService) {
        this.budgetRepository = budgetRepository;
        this.tripRepository = tripRepository;
        this.expenseRepository = expenseRepository;
        this.tripService = tripService;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public BudgetDTO getTripBudget(Long tripId, User user) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        if (!tripService.isUserAuthorizedForTrip(trip, user)) {
            throw new ForbiddenException("Not authorized to view this trip's budget");
        }

        Budget budget = budgetRepository.findByTrip(trip)
                .orElseGet(() -> {
                    Budget b = new Budget(trip, trip.getTotalBudget());
                    return budgetRepository.save(b);
                });

        return mapToDTO(budget, trip);
    }

    @Transactional
    public BudgetDTO updateTripBudget(Long tripId, BudgetDTO dto, User user) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        if (!tripService.isGroupAdmin(trip, user)) {
            throw new ForbiddenException("Only trip admins can update budget allocations");
        }

        Budget budget = budgetRepository.findByTrip(trip)
                .orElse(new Budget(trip, dto.getTotalAmount()));

        if (dto.getTotalAmount() != null) {
            budget.setTotalAmount(dto.getTotalAmount());
            trip.setTotalBudget(dto.getTotalAmount());
            tripRepository.save(trip);
        }

        if (dto.getTransportationBudget() != null) budget.setTransportationBudget(dto.getTransportationBudget());
        if (dto.getHotelBudget() != null) budget.setHotelBudget(dto.getHotelBudget());
        if (dto.getFoodBudget() != null) budget.setFoodBudget(dto.getFoodBudget());
        if (dto.getShoppingBudget() != null) budget.setShoppingBudget(dto.getShoppingBudget());
        if (dto.getEntertainmentBudget() != null) budget.setEntertainmentBudget(dto.getEntertainmentBudget());
        if (dto.getMiscBudget() != null) budget.setMiscBudget(dto.getMiscBudget());
        if (dto.getCurrency() != null) budget.setCurrency(dto.getCurrency());

        Budget saved = budgetRepository.save(budget);
        return mapToDTO(saved, trip);
    }

    public BudgetDTO mapToDTO(Budget budget, Trip trip) {
        BudgetDTO dto = new BudgetDTO();
        dto.setId(budget.getId());
        dto.setTripId(trip.getId());
        dto.setTotalAmount(budget.getTotalAmount());
        dto.setTransportationBudget(budget.getTransportationBudget());
        dto.setHotelBudget(budget.getHotelBudget());
        dto.setFoodBudget(budget.getFoodBudget());
        dto.setShoppingBudget(budget.getShoppingBudget());
        dto.setEntertainmentBudget(budget.getEntertainmentBudget());
        dto.setMiscBudget(budget.getMiscBudget());
        dto.setCurrency(budget.getCurrency());

        Double totalSpent = expenseRepository.sumAmountByTrip(trip);
        double spent = totalSpent != null ? totalSpent : 0.0;
        dto.setTotalSpent(spent);
        dto.setRemainingAmount(Math.max(0.0, budget.getTotalAmount() - spent));

        if (budget.getTotalAmount() > 0) {
            dto.setUtilizationPercentage(Math.round((spent / budget.getTotalAmount() * 100.0) * 10.0) / 10.0);
        } else {
            dto.setUtilizationPercentage(0.0);
        }

        Map<String, Double> categoryMap = new HashMap<>();
        List<Object[]> categorySums = expenseRepository.sumAmountByTripGroupByCategory(trip);
        for (Object[] row : categorySums) {
            categoryMap.put(row[0].toString(), (Double) row[1]);
        }
        dto.setSpentByCategory(categoryMap);

        return dto;
    }
}
