package com.tripnest.service;

import com.tripnest.dto.ExpenseDTO;
import com.tripnest.entity.Expense;
import com.tripnest.entity.Notification;
import com.tripnest.entity.Trip;
import com.tripnest.entity.User;
import com.tripnest.exception.ForbiddenException;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.repository.ExpenseRepository;
import com.tripnest.repository.TripRepository;
import com.tripnest.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final TripService tripService;
    private final NotificationService notificationService;

    public ExpenseService(ExpenseRepository expenseRepository,
                          TripRepository tripRepository,
                          UserRepository userRepository,
                          TripService tripService,
                          NotificationService notificationService) {
        this.expenseRepository = expenseRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.tripService = tripService;
        this.notificationService = notificationService;
    }

    @Transactional
    public ExpenseDTO addExpense(Long tripId, ExpenseDTO dto, User user) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        if (!tripService.isUserAuthorizedForTrip(trip, user)) {
            throw new ForbiddenException("Not authorized to add expenses to this trip");
        }

        Expense expense = new Expense();
        expense.setTrip(trip);
        expense.setTitle(dto.getTitle().trim());
        expense.setAmount(dto.getAmount());
        expense.setCategory(dto.getCategory() != null ? dto.getCategory() : Expense.ExpenseCategory.MISCELLANEOUS);
        expense.setExpenseDate(dto.getExpenseDate());

        if (dto.getPaidById() != null) {
            User payer = userRepository.findById(dto.getPaidById()).orElse(user);
            expense.setPaidBy(payer);
        } else {
            expense.setPaidBy(user);
        }

        expense.setPaymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "CASH");
        expense.setNotes(dto.getNotes());
        expense.setReceiptUrl(dto.getReceiptUrl());

        Expense saved = expenseRepository.save(expense);

        // Check budget utilization and trigger alert if over budget
        Double totalSpent = expenseRepository.sumAmountByTrip(trip);
        if (trip.getTotalBudget() > 0 && totalSpent != null && totalSpent > trip.getTotalBudget()) {
            notificationService.createNotification(
                    trip.getOwner(),
                    "Budget Alert: " + trip.getTitle(),
                    String.format("Trip expenses ($%.2f) have exceeded the planned budget ($%.2f)!", totalSpent, trip.getTotalBudget()),
                    Notification.NotificationType.BUDGET_ALERT,
                    "/trips/" + trip.getId() + "/budget"
            );
        }

        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<ExpenseDTO> getExpensesByTrip(Long tripId, User user) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        if (!tripService.isUserAuthorizedForTrip(trip, user)) {
            throw new ForbiddenException("Not authorized to view expenses for this trip");
        }

        return expenseRepository.findByTripOrderByExpenseDateDesc(trip).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ExpenseDTO updateExpense(Long id, ExpenseDTO dto, User user) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", id));

        if (!tripService.isUserAuthorizedForTrip(expense.getTrip(), user)) {
            throw new ForbiddenException("Not authorized to modify this expense");
        }

        expense.setTitle(dto.getTitle().trim());
        expense.setAmount(dto.getAmount());
        if (dto.getCategory() != null) expense.setCategory(dto.getCategory());
        if (dto.getExpenseDate() != null) expense.setExpenseDate(dto.getExpenseDate());
        if (dto.getPaymentMethod() != null) expense.setPaymentMethod(dto.getPaymentMethod());
        expense.setNotes(dto.getNotes());
        if (dto.getReceiptUrl() != null) expense.setReceiptUrl(dto.getReceiptUrl());

        if (dto.getPaidById() != null) {
            User payer = userRepository.findById(dto.getPaidById()).orElse(expense.getPaidBy());
            expense.setPaidBy(payer);
        }

        return mapToDTO(expenseRepository.save(expense));
    }

    @Transactional
    public void deleteExpense(Long id, User user) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", id));

        if (!tripService.isUserAuthorizedForTrip(expense.getTrip(), user)) {
            throw new ForbiddenException("Not authorized to delete this expense");
        }

        expenseRepository.delete(expense);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getExpenseSummary(Long tripId, User user) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        if (!tripService.isUserAuthorizedForTrip(trip, user)) {
            throw new ForbiddenException("Not authorized to view expense summary");
        }

        Double totalSpent = expenseRepository.sumAmountByTrip(trip);
        double spent = totalSpent != null ? totalSpent : 0.0;

        Map<String, Double> categoryMap = new HashMap<>();
        List<Object[]> categorySums = expenseRepository.sumAmountByTripGroupByCategory(trip);
        for (Object[] row : categorySums) {
            categoryMap.put(row[0].toString(), (Double) row[1]);
        }

        Map<String, Double> payerMap = new HashMap<>();
        List<Object[]> payerSums = expenseRepository.sumAmountByTripGroupByPaidBy(trip);
        for (Object[] row : payerSums) {
            String payerName = row[1] != null ? row[1].toString() : "Unknown";
            payerMap.put(payerName, (Double) row[2]);
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("tripId", tripId);
        summary.put("totalBudget", trip.getTotalBudget());
        summary.put("totalSpent", spent);
        summary.put("remainingBudget", Math.max(0.0, trip.getTotalBudget() - spent));
        summary.put("categoryBreakdown", categoryMap);
        summary.put("payerBreakdown", payerMap);

        return summary;
    }

    public ExpenseDTO mapToDTO(Expense e) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(e.getId());
        dto.setTripId(e.getTrip().getId());
        dto.setTitle(e.getTitle());
        dto.setAmount(e.getAmount());
        dto.setCategory(e.getCategory());
        dto.setExpenseDate(e.getExpenseDate());

        if (e.getPaidBy() != null) {
            dto.setPaidById(e.getPaidBy().getId());
            dto.setPaidByName(e.getPaidBy().getFullName());
            dto.setPaidByEmail(e.getPaidBy().getEmail());
        }

        dto.setPaymentMethod(e.getPaymentMethod());
        dto.setNotes(e.getNotes());
        dto.setReceiptUrl(e.getReceiptUrl());
        dto.setCreatedAt(e.getCreatedAt());
        return dto;
    }
}
