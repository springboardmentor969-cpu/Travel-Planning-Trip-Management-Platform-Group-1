package com.tripnest.service;

import com.tripnest.dto.AdminAnalyticsDTO;
import com.tripnest.dto.TravelerAnalyticsDTO;
import com.tripnest.dto.UserProfileDTO;
import com.tripnest.entity.Expense;
import com.tripnest.entity.Role;
import com.tripnest.entity.Trip;
import com.tripnest.entity.User;
import com.tripnest.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final TripRepository tripRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;
    private final UserService userService;

    public AnalyticsService(TripRepository tripRepository,
                            ExpenseRepository expenseRepository,
                            UserRepository userRepository,
                            DestinationRepository destinationRepository,
                            UserService userService) {
        this.tripRepository = tripRepository;
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
        this.destinationRepository = destinationRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public TravelerAnalyticsDTO getTravelerAnalytics(User user) {
        List<Trip> userTrips = tripRepository.findAllAccessibleByUser(user);
        LocalDate today = LocalDate.now();

        int totalTrips = userTrips.size();
        int upcoming = 0;
        int active = 0;
        int completed = 0;
        int daysTraveled = 0;
        double totalPlanned = 0.0;
        double totalSpent = 0.0;

        Set<String> uniqueDestinations = new HashSet<>();
        Map<String, Integer> statusCount = new HashMap<>();
        Map<String, Double> categoryExpenses = new HashMap<>();
        Map<String, Double> monthlyExpenses = new HashMap<>();

        // Initialize category defaults
        for (Expense.ExpenseCategory cat : Expense.ExpenseCategory.values()) {
            categoryExpenses.put(cat.name(), 0.0);
        }

        DateTimeFormatter monthYearFormat = DateTimeFormatter.ofPattern("MMM yyyy");

        for (Trip t : userTrips) {
            totalPlanned += (t.getTotalBudget() != null ? t.getTotalBudget() : 0.0);
            uniqueDestinations.add(t.getDestination());

            if (t.getStatus() == Trip.TripStatus.COMPLETED || t.getEndDate().isBefore(today)) {
                completed++;
                long duration = ChronoUnit.DAYS.between(t.getStartDate(), t.getEndDate()) + 1;
                daysTraveled += (int) Math.max(1, duration);
            } else if (t.getStatus() == Trip.TripStatus.ONGOING || (!today.isBefore(t.getStartDate()) && !today.isAfter(t.getEndDate()))) {
                active++;
                long duration = ChronoUnit.DAYS.between(t.getStartDate(), today) + 1;
                daysTraveled += (int) Math.max(1, duration);
            } else if (t.getStatus() == Trip.TripStatus.PLANNED) {
                upcoming++;
            }

            statusCount.put(t.getStatus().name(), statusCount.getOrDefault(t.getStatus().name(), 0) + 1);

            List<Expense> expenses = expenseRepository.findByTripOrderByExpenseDateDesc(t);
            for (Expense exp : expenses) {
                totalSpent += exp.getAmount();
                categoryExpenses.put(exp.getCategory().name(),
                        categoryExpenses.getOrDefault(exp.getCategory().name(), 0.0) + exp.getAmount());

                String monthKey = exp.getExpenseDate().format(monthYearFormat);
                monthlyExpenses.put(monthKey,
                        monthlyExpenses.getOrDefault(monthKey, 0.0) + exp.getAmount());
            }
        }

        TravelerAnalyticsDTO dto = new TravelerAnalyticsDTO();
        dto.setTotalTrips(totalTrips);
        dto.setUpcomingTrips(upcoming);
        dto.setActiveTrips(active);
        dto.setCompletedTrips(completed);
        dto.setDaysTraveled(daysTraveled);
        dto.setCountriesVisited(uniqueDestinations.size());
        dto.setTotalBudgetSpent(Math.round(totalSpent * 100.0) / 100.0);
        dto.setTotalBudgetPlanned(Math.round(totalPlanned * 100.0) / 100.0);
        dto.setExpensesByCategory(categoryExpenses);
        dto.setSpendingByMonth(monthlyExpenses);
        dto.setTripsByStatus(statusCount);
        dto.setTopDestinations(new ArrayList<>(uniqueDestinations));

        return dto;
    }

    @Transactional(readOnly = true)
    public AdminAnalyticsDTO getAdminAnalytics() {
        AdminAnalyticsDTO dto = new AdminAnalyticsDTO();

        long totalUsers = userRepository.count();
        long totalTravelers = userRepository.countByRole(Role.ROLE_TRAVELER) + userRepository.countByRole(Role.ROLE_GROUP_ADMIN);
        long totalAdmins = userRepository.countByRole(Role.ROLE_ADMIN);

        long totalTrips = tripRepository.count();
        long activeTrips = tripRepository.countByStatus(Trip.TripStatus.ONGOING);
        long completedTrips = tripRepository.countByStatus(Trip.TripStatus.COMPLETED);
        long totalDestinations = destinationRepository.count();

        Double totalExpenses = expenseRepository.sumTotalAllExpenses();

        Map<String, Long> statusMap = new HashMap<>();
        for (Trip.TripStatus status : Trip.TripStatus.values()) {
            statusMap.put(status.name(), tripRepository.countByStatus(status));
        }

        List<Object[]> popular = tripRepository.findPopularTripDestinations();
        List<Map<String, Object>> popularDestinations = new ArrayList<>();
        for (Object[] row : popular) {
            Map<String, Object> map = new HashMap<>();
            map.put("destination", row[0]);
            map.put("count", row[1]);
            popularDestinations.add(map);
        }

        List<UserProfileDTO> recentUsers = userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getCreatedAt).reversed())
                .limit(10)
                .map(userService::mapToDTO)
                .collect(Collectors.toList());

        dto.setTotalUsers(totalUsers);
        dto.setTotalTravelers(totalTravelers);
        dto.setTotalAdmins(totalAdmins);
        dto.setTotalTrips(totalTrips);
        dto.setActiveTrips(activeTrips);
        dto.setCompletedTrips(completedTrips);
        dto.setTotalDestinations(totalDestinations);
        dto.setTotalPlatformExpenses(totalExpenses != null ? totalExpenses : 0.0);
        dto.setTripsByStatus(statusMap);
        dto.setPopularDestinations(popularDestinations);
        dto.setRecentUsers(recentUsers);

        return dto;
    }
}
