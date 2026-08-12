package com.tripnest.service;

import com.tripnest.dto.BudgetResponse;
import com.tripnest.dto.CategoryExpenseSummary;
import com.tripnest.dto.ExpenseRequest;
import com.tripnest.dto.ExpenseResponse;
import com.tripnest.entity.Notification;
import com.tripnest.entity.Trip;
import com.tripnest.entity.TripExpense;
import com.tripnest.exception.ApiException;
import com.tripnest.repository.NotificationRepository;
import com.tripnest.repository.TripExpenseRepository;
import com.tripnest.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final TripRepository tripRepository;
    private final TripExpenseRepository expenseRepository;
    private final TripAccessService tripAccessService;
    private final NotificationRepository notificationRepository;

    public BudgetResponse getBudget(Long userId, Long tripId) {
        Trip trip = tripAccessService.findAccessibleTrip(userId, tripId);
        List<TripExpense> expenses = expenseRepository.findByTripIdOrderByDateDesc(tripId);

        double totalSpent = expenses.stream().mapToDouble(TripExpense::getAmount).sum();
        double totalBudget = trip.getBudget() != null ? trip.getBudget() : 0.0;
        double remaining = totalBudget - totalSpent;

        Map<String, Double> categoryBreakdown = new HashMap<>();
        for (TripExpense expense : expenses) {
            String category = expense.getCategory() != null ? expense.getCategory() : "MISCELLANEOUS";
            categoryBreakdown.put(category, categoryBreakdown.getOrDefault(category, 0.0) + expense.getAmount());
        }

        List<CategoryExpenseSummary> byCategory = categoryBreakdown.entrySet().stream()
                .map(entry -> new CategoryExpenseSummary(entry.getKey(), entry.getValue()))
                .toList();

        return BudgetResponse.builder()
                .totalBudget(totalBudget)
                .totalSpent(totalSpent)
                .remaining(remaining)
                .categoryBreakdown(categoryBreakdown)
                .byCategory(byCategory)
                .build();
    }

    @Transactional
    public BudgetResponse updateBudget(Long userId, Long tripId, Double newBudget) {
        Trip trip = tripAccessService.findAccessibleTrip(userId, tripId);
        trip.setBudget(newBudget);
        tripRepository.save(trip);
        checkBudgetAlert(trip);
        return getBudget(userId, tripId);
    }

    public List<ExpenseResponse> getExpenses(Long userId, Long tripId) {
        tripAccessService.findAccessibleTrip(userId, tripId);
        return expenseRepository.findByTripIdOrderByDateDesc(tripId).stream()
                .map(ExpenseResponse::from)
                .toList();
    }

    @Transactional
    public ExpenseResponse addExpense(Long userId, Long tripId, ExpenseRequest request) {
        Trip trip = tripAccessService.findAccessibleTrip(userId, tripId);

        TripExpense expense = TripExpense.builder()
                .title(request.getTitle())
                .amount(request.getAmount())
                .category(request.getCategory())
                .date(request.getDate())
                .paidBy(request.getPaidBy())
                .trip(trip)
                .build();

        expenseRepository.save(expense);
        checkBudgetAlert(trip);
        return ExpenseResponse.from(expense);
    }

    @Transactional
    public ExpenseResponse updateExpense(Long userId, Long tripId, Long expenseId, ExpenseRequest request) {
        Trip trip = tripAccessService.findAccessibleTrip(userId, tripId);
        TripExpense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> ApiException.notFound("Expense not found."));

        if (!expense.getTrip().getId().equals(tripId)) {
            throw ApiException.notFound("Expense not found.");
        }

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expense.setPaidBy(request.getPaidBy());

        expenseRepository.save(expense);
        checkBudgetAlert(trip);
        return ExpenseResponse.from(expense);
    }

    @Transactional
    public void deleteExpense(Long userId, Long tripId, Long expenseId) {
        tripAccessService.findAccessibleTrip(userId, tripId);
        TripExpense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> ApiException.notFound("Expense not found."));

        if (!expense.getTrip().getId().equals(tripId)) {
            throw ApiException.notFound("Expense not found.");
        }

        expenseRepository.delete(expense);
    }

    @Transactional
    public ExpenseResponse uploadReceipt(Long userId, Long tripId, Long expenseId, String receiptUrl) {
        tripAccessService.findAccessibleTrip(userId, tripId);
        TripExpense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> ApiException.notFound("Expense not found."));

        if (!expense.getTrip().getId().equals(tripId)) {
            throw ApiException.notFound("Expense not found.");
        }

        expense.setReceiptUrl(receiptUrl);
        expenseRepository.save(expense);
        return ExpenseResponse.from(expense);
    }

    private void checkBudgetAlert(Trip trip) {
        if (trip.getBudget() == null || trip.getBudget() <= 0) return;

        List<TripExpense> expenses = expenseRepository.findByTripIdOrderByDateDesc(trip.getId());
        double totalSpent = expenses.stream().mapToDouble(TripExpense::getAmount).sum();

        if (totalSpent >= 0.8 * trip.getBudget()) {
            int percent = (int) Math.round((totalSpent / trip.getBudget()) * 100);
            String title = totalSpent > trip.getBudget() ? "Budget Exceeded Alert 🚨" : "Budget Warning ⚠️";
            String msg = String.format("Expenses for '%s' reached %d%% of your total budget (Spent: ₹%.0f / Budget: ₹%.0f).",
                    trip.getDestination(), percent, totalSpent, trip.getBudget());

            Notification notification = Notification.builder()
                    .user(trip.getOwner())
                    .title(title)
                    .message(msg)
                    .type("BUDGET_ALERT")
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);
        }
    }
}
