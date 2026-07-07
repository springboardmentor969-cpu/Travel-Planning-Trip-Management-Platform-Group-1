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

    public DashboardService(TripRepository tripRepository, ExpenseRepository expenseRepository) {
        this.tripRepository = tripRepository;
        this.expenseRepository = expenseRepository;
    }

    public DashboardDto getDashboard() {
        BigDecimal totalBudget = tripRepository.findAll().stream()
                .map(trip -> trip.getBudget() == null ? BigDecimal.ZERO : trip.getBudget())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpenses = expenseRepository.sumAllAmounts();
        return new DashboardDto(
                tripRepository.count(),
                tripRepository.findTop5ByStartDateGreaterThanEqualOrderByStartDateAsc(LocalDate.now()).stream()
                        .map(TripMapper::toDto)
                        .toList(),
                totalExpenses,
                totalBudget.subtract(totalExpenses)
        );
    }
}
