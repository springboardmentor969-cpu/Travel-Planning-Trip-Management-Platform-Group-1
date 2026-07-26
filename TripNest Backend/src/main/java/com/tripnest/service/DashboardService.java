package com.tripnest.service;

import com.tripnest.dto.DashboardSummaryResponse;
import com.tripnest.dto.TripResponse;
import com.tripnest.entity.Trip;
import com.tripnest.entity.TripStatus;
import com.tripnest.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TripRepository tripRepository;

    public DashboardSummaryResponse getSummary(Long userId) {
        List<Trip> upcoming = tripRepository
                .findByOwnerIdAndStatusInAndStartDateGreaterThanEqualOrderByStartDateAsc(
                        userId,
                        List.of(TripStatus.PLANNING, TripStatus.UPCOMING),
                        LocalDate.now()
                );

        long totalTrips = tripRepository.countByOwnerId(userId);

        List<Trip> completed = tripRepository.findByOwnerIdAndStatusOrderByStartDateAsc(
                userId, TripStatus.COMPLETED);

        int totalDaysTravelled = completed.stream()
                .mapToInt(t -> (int) ChronoUnit.DAYS.between(t.getStartDate(), t.getEndDate()) + 1)
                .sum();

        double totalPlanned = tripRepository.findByOwnerIdOrderByStartDateAsc(userId).stream()
                .mapToDouble(Trip::getBudget)
                .sum();

        return DashboardSummaryResponse.builder()
                .upcomingTrips(upcoming.stream().map(TripResponse::from).toList())
                .budgetOverview(DashboardSummaryResponse.BudgetOverview.builder()
                        .totalPlanned(totalPlanned)
                        .build())
                // Expense totals come from Module 5 (Budget & Expense service) once that's built;
                // reporting 0 here until expenses are wired up.
                .expenseSummary(DashboardSummaryResponse.ExpenseSummary.builder()
                        .totalSpent(0.0)
                        .build())
                .travelStats(DashboardSummaryResponse.TravelStats.builder()
                        .totalTrips(totalTrips)
                        .countriesVisited(0)
                        .totalDaysTravelled(totalDaysTravelled)
                        .build())
                .favoriteDestinations(List.of())
                .build();
    }
}