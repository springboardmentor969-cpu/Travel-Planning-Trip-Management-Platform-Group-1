package com.tripnest.service;

import com.tripnest.dto.BudgetResponse;
import com.tripnest.dto.ExpenseRequest;
import com.tripnest.dto.ExpenseResponse;
import com.tripnest.entity.Trip;
import com.tripnest.entity.TripExpense;
import com.tripnest.entity.User;
import com.tripnest.repository.NotificationRepository;
import com.tripnest.repository.TripExpenseRepository;
import com.tripnest.repository.TripRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private TripExpenseRepository expenseRepository;

    @Mock
    private TripAccessService tripAccessService;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private BudgetService budgetService;

    private Trip testTrip;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).email("test@example.com").name("Test User").build();
        testTrip = Trip.builder().id(100L).destination("Paris").budget(50000.0).owner(testUser).build();
    }

    @Test
    void getBudget_returnsCalculatedBudgetAndCategoryBreakdown() {
        when(tripAccessService.findAccessibleTrip(1L, 100L)).thenReturn(testTrip);
        TripExpense exp1 = TripExpense.builder().id(1L).amount(10000.0).category("FOOD").trip(testTrip).build();
        TripExpense exp2 = TripExpense.builder().id(2L).amount(20000.0).category("HOTEL").trip(testTrip).build();

        when(expenseRepository.findByTripIdOrderByDateDesc(100L)).thenReturn(List.of(exp1, exp2));

        BudgetResponse response = budgetService.getBudget(1L, 100L);

        assertEquals(50000.0, response.getTotalBudget());
        assertEquals(30000.0, response.getTotalSpent());
        assertEquals(20000.0, response.getRemaining());
        assertNotNull(response.getByCategory());
        assertEquals(2, response.getByCategory().size());
    }

    @Test
    void addExpense_triggersBudgetAlertWhenSpentExceedsThreshold() {
        when(tripAccessService.findAccessibleTrip(1L, 100L)).thenReturn(testTrip);
        TripExpense exp = TripExpense.builder().id(1L).amount(45000.0).category("FLIGHT").trip(testTrip).build();
        when(expenseRepository.save(any(TripExpense.class))).thenReturn(exp);

        TripExpense highExpense = TripExpense.builder().id(1L).amount(45000.0).category("FLIGHT").trip(testTrip).build();
        when(expenseRepository.findByTripIdOrderByDateDesc(100L)).thenReturn(List.of(highExpense));

        ExpenseRequest request = new ExpenseRequest();
        request.setTitle("Flight to Paris");
        request.setAmount(45000.0);
        request.setCategory("FLIGHT");
        request.setDate(LocalDate.now());

        ExpenseResponse response = budgetService.addExpense(1L, 100L, request);

        assertNotNull(response);
        verify(notificationRepository, times(1)).save(any());
    }
}
