package com.tripnest.service;

import com.tripnest.dto.DashboardDto;
import com.tripnest.mapper.TripMapper;
import com.tripnest.repository.ExpenseRepository;
import com.tripnest.repository.TripRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardService {
    private final TripRepository tripRepository;
    private final ExpenseRepository expenseRepository;
    private final UserService userService;

    public DashboardService(TripRepository tripRepository, ExpenseRepository expenseRepository, UserService userService) {
        this.tripRepository = tripRepository;
        this.expenseRepository = expenseRepository;
        this.userService = userService;
    }

    public DashboardDto getDashboard() {
        Long userId = userService.getCurrentUser().getId();
        BigDecimal totalBudget = tripRepository.findByUserIdOrderByStartDateAsc(userId).stream()
                .map(trip -> trip.getBudget() == null ? BigDecimal.ZERO : trip.getBudget())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpenses = expenseRepository.sumByTripUserId(userId);
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;
        return new DashboardDto(
                tripRepository.countByUserId(userId),
                tripRepository.findTop5ByUserIdAndStartDateGreaterThanEqualOrderByStartDateAsc(userId, LocalDate.now()).stream()
                        .map(TripMapper::toDto)
                        .toList(),
                totalExpenses,
                totalBudget.subtract(totalExpenses)
        );
    }
}
