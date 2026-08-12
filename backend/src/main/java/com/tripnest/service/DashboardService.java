package com.tripnest.service;

import com.tripnest.dto.DashboardSummaryResponse;
import com.tripnest.dto.TripResponse;
import com.tripnest.entity.Trip;
import com.tripnest.entity.TripExpense;
import com.tripnest.entity.TripStatus;
import com.tripnest.entity.TripMember;
import com.tripnest.entity.User;
import com.tripnest.repository.TripExpenseRepository;
import com.tripnest.repository.TripMemberRepository;
import com.tripnest.repository.TripRepository;
import com.tripnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final TripMemberRepository memberRepository;
    private final TripExpenseRepository expenseRepository;

    private List<Trip> getAllAccessibleTrips(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        String userEmail = user != null && user.getEmail() != null ? user.getEmail() : "";

        Map<Long, Trip> tripMap = new LinkedHashMap<>();

        // 1. Owned trips
        List<Trip> ownedTrips = tripRepository.findByOwnerIdOrderByStartDateAsc(userId);
        for (Trip t : ownedTrips) {
            tripMap.put(t.getId(), t);
        }

        // 2. Member trips by user ID
        List<TripMember> memberByUser = memberRepository.findByUserIdAndStatus(userId, "ACCEPTED");
        for (TripMember tm : memberByUser) {
            if (tm.getTrip() != null) {
                tripMap.putIfAbsent(tm.getTrip().getId(), tm.getTrip());
            }
        }

        // 3. Member trips by email
        if (!userEmail.isBlank()) {
            List<TripMember> memberByEmail = memberRepository.findByEmailIgnoreCaseAndStatus(userEmail, "ACCEPTED");
            for (TripMember tm : memberByEmail) {
                if (tm.getTrip() != null) {
                    tripMap.putIfAbsent(tm.getTrip().getId(), tm.getTrip());
                }
            }
        }

        List<Trip> trips = new ArrayList<>(tripMap.values());
        trips.sort((t1, t2) -> {
            if (t1.getStartDate() == null) return 1;
            if (t2.getStartDate() == null) return -1;
            return t1.getStartDate().compareTo(t2.getStartDate());
        });
        return trips;
    }

    public DashboardSummaryResponse getSummary(Long userId) {
        List<Trip> allUserTrips = getAllAccessibleTrips(userId);

        List<Trip> upcoming = allUserTrips.stream()
                .filter(t -> (t.getStatus() == TripStatus.PLANNING || t.getStatus() == TripStatus.UPCOMING)
                        && t.getStartDate() != null && !t.getStartDate().isBefore(LocalDate.now()))
                .toList();

        long totalTrips = allUserTrips.size();

        List<Trip> completed = allUserTrips.stream()
                .filter(t -> t.getStatus() == TripStatus.COMPLETED)
                .toList();

        int totalDaysTravelled = completed.stream()
                .filter(t -> t.getStartDate() != null && t.getEndDate() != null)
                .mapToInt(t -> (int) ChronoUnit.DAYS.between(t.getStartDate(), t.getEndDate()) + 1)
                .sum();

        double totalPlanned = allUserTrips.stream()
                .filter(t -> t.getBudget() != null)
                .mapToDouble(Trip::getBudget)
                .sum();

        List<Long> tripIds = allUserTrips.stream().map(Trip::getId).toList();
        double totalSpent = 0.0;
        if (!tripIds.isEmpty()) {
            totalSpent = expenseRepository.findByTripIdIn(tripIds).stream()
                    .mapToDouble(TripExpense::getAmount)
                    .sum();
        }

        int countriesVisited = (int) allUserTrips.stream()
                .map(Trip::getDestination)
                .filter(d -> d != null && !d.isBlank())
                .map(d -> d.trim().toLowerCase())
                .distinct()
                .count();

        return DashboardSummaryResponse.builder()
                .upcomingTrips(upcoming.stream().map(TripResponse::from).toList())
                .budgetOverview(DashboardSummaryResponse.BudgetOverview.builder()
                        .totalPlanned(totalPlanned)
                        .build())
                .expenseSummary(DashboardSummaryResponse.ExpenseSummary.builder()
                        .totalSpent(totalSpent)
                        .build())
                .travelStats(DashboardSummaryResponse.TravelStats.builder()
                        .totalTrips(totalTrips)
                        .countriesVisited(countriesVisited)
                        .totalDaysTravelled(totalDaysTravelled)
                        .build())
                .favoriteDestinations(List.of())
                .build();
    }

    public com.tripnest.dto.TravelStatsResponse getTravelStats(Long userId) {
        List<Trip> allUserTrips = getAllAccessibleTrips(userId);

        long totalTrips = allUserTrips.size();

        List<Trip> completed = allUserTrips.stream()
                .filter(t -> t.getStatus() == TripStatus.COMPLETED)
                .toList();

        int totalDaysTravelled = completed.stream()
                .filter(t -> t.getStartDate() != null && t.getEndDate() != null)
                .mapToInt(t -> (int) ChronoUnit.DAYS.between(t.getStartDate(), t.getEndDate()) + 1)
                .sum();

        int countriesVisited = (int) allUserTrips.stream()
                .map(Trip::getDestination)
                .filter(d -> d != null && !d.isBlank())
                .map(d -> d.trim().toLowerCase())
                .distinct()
                .count();

        return com.tripnest.dto.TravelStatsResponse.builder()
                .totalTrips(totalTrips)
                .countriesVisited(countriesVisited)
                .totalDaysTravelled(totalDaysTravelled)
                .build();
    }
}