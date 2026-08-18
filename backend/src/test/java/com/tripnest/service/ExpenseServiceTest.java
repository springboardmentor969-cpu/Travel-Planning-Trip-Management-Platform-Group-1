package com.tripnest.service;

import com.tripnest.dto.ExpenseDTO;
import com.tripnest.entity.Expense;
import com.tripnest.entity.Role;
import com.tripnest.entity.Trip;
import com.tripnest.entity.User;
import com.tripnest.repository.ExpenseRepository;
import com.tripnest.repository.TripRepository;
import com.tripnest.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private TripRepository tripRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TripService tripService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ExpenseService expenseService;

    private User user;
    private Trip trip;
    private ExpenseDTO expenseDTO;

    @BeforeEach
    void setUp() {
        user = new User("traveler@tripnest.com", "hash", "Maya Lin", Role.ROLE_TRAVELER);
        user.setId(1L);

        trip = new Trip();
        trip.setId(10L);
        trip.setTitle("Paris Trip");
        trip.setTotalBudget(1000.0);
        trip.setOwner(user);

        expenseDTO = new ExpenseDTO();
        expenseDTO.setTitle("Louvre Entry Tickets");
        expenseDTO.setAmount(45.0);
        expenseDTO.setCategory(Expense.ExpenseCategory.ENTERTAINMENT);
        expenseDTO.setExpenseDate(LocalDate.now());
    }

    @Test
    void testAddExpense_Success() {
        when(tripRepository.findById(10L)).thenReturn(Optional.of(trip));
        when(tripService.isUserAuthorizedForTrip(trip, user)).thenReturn(true);

        Expense saved = new Expense();
        saved.setId(100L);
        saved.setTrip(trip);
        saved.setTitle(expenseDTO.getTitle());
        saved.setAmount(expenseDTO.getAmount());
        saved.setCategory(expenseDTO.getCategory());
        saved.setExpenseDate(expenseDTO.getExpenseDate());
        saved.setPaidBy(user);

        when(expenseRepository.save(any(Expense.class))).thenReturn(saved);
        when(expenseRepository.sumAmountByTrip(trip)).thenReturn(45.0);

        ExpenseDTO result = expenseService.addExpense(10L, expenseDTO, user);

        assertNotNull(result);
        assertEquals("Louvre Entry Tickets", result.getTitle());
        assertEquals(45.0, result.getAmount());
        verify(expenseRepository, times(1)).save(any(Expense.class));
    }
}
