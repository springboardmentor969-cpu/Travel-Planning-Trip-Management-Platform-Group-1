package com.tripnest.service;

import com.tripnest.dto.AdminAnalyticsDto;
import com.tripnest.dto.ChartDataPointDto;
import com.tripnest.dto.TripBudgetReportDto;
import com.tripnest.dto.UserAnalyticsDto;
import com.tripnest.entity.Expense;
import com.tripnest.entity.Trip;
import com.tripnest.entity.TripStatus;
import com.tripnest.repository.ExpenseRepository;
import com.tripnest.repository.TripRepository;
import com.tripnest.repository.UserRepository;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AnalyticsService {
    private final TripRepository tripRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public AnalyticsService(TripRepository tripRepository, ExpenseRepository expenseRepository, UserRepository userRepository, UserService userService) {
        this.tripRepository = tripRepository;
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public UserAnalyticsDto getUserAnalytics() {
        Long userId = userService.getCurrentUser().getId();
        List<Trip> trips = tripRepository.findByUserIdOrderByStartDateAsc(userId);
        List<Expense> expenses = expenseRepository.findByTripUserId(userId);
        BigDecimal budget = trips.stream().map(Trip::getBudget).filter(java.util.Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal spent = expenses.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<Long, BigDecimal> spentByTrip = expenses.stream().collect(Collectors.groupingBy(expense -> expense.getTrip().getId(), Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)));
        return new UserAnalyticsDto(budget, spent, byCategory(expenses), byMonth(expenses), trips.stream()
                .map(trip -> new TripBudgetReportDto(trip.getId(), trip.getTitle(), trip.getBudget(), spentByTrip.getOrDefault(trip.getId(), BigDecimal.ZERO)))
                .toList());
    }

    public AdminAnalyticsDto getAdminAnalytics() {
        List<Expense> expenses = expenseRepository.findAll();
        EnumMap<TripStatus, Long> statuses = new EnumMap<>(TripStatus.class);
        tripRepository.findAll().forEach(trip -> statuses.merge(trip.getStatus(), 1L, Long::sum));
        List<ChartDataPointDto> statusData = java.util.Arrays.stream(TripStatus.values())
                .map(status -> new ChartDataPointDto(titleCase(status.name()), BigDecimal.valueOf(statuses.getOrDefault(status, 0L))))
                .toList();
        BigDecimal total = expenses.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new AdminAnalyticsDto(userRepository.count(), tripRepository.count(), total, statusData, byCategory(expenses), byMonth(expenses));
    }

    private List<ChartDataPointDto> byCategory(List<Expense> expenses) {
        return points(expenses, Expense::getCategory, Comparator.naturalOrder());
    }

    private List<ChartDataPointDto> byMonth(List<Expense> expenses) {
        Map<String, BigDecimal> totals = expenses.stream().collect(Collectors.groupingBy(expense -> YearMonth.from(expense.getExpenseDate()).toString(), LinkedHashMap::new, Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)));
        return totals.entrySet().stream().sorted(Map.Entry.comparingByKey()).map(entry -> new ChartDataPointDto(entry.getKey(), entry.getValue())).toList();
    }

    private List<ChartDataPointDto> points(List<Expense> expenses, Function<Expense, String> label, Comparator<String> order) {
        return expenses.stream().collect(Collectors.groupingBy(label, Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add))).entrySet().stream()
                .sorted(Map.Entry.comparingByKey(order)).map(entry -> new ChartDataPointDto(entry.getKey(), entry.getValue())).toList();
    }

    private String titleCase(String value) { return value.substring(0, 1) + value.substring(1).toLowerCase().replace('_', ' '); }
}
