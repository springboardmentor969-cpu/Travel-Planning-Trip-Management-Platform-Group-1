package com.tripnest.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import com.tripnest.repository.ExpenseRepository;
import com.tripnest.repository.TripRepository;
import com.tripnest.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {
    @Mock private TripRepository tripRepository;
    @Mock private ExpenseRepository expenseRepository;
    @Mock private UserRepository userRepository;
    @Mock private UserService userService;
    @InjectMocks private AnalyticsService analyticsService;

    @Test
    void returnsEmptyButChartReadyAdminAnalyticsWhenNoDataExists() {
        when(userRepository.count()).thenReturn(0L);
        when(tripRepository.count()).thenReturn(0L);
        when(tripRepository.findAll()).thenReturn(List.of());
        when(expenseRepository.findAll()).thenReturn(List.of());

        var result = analyticsService.getAdminAnalytics();

        assertEquals(0, result.totalUsers());
        assertEquals(BigDecimal.ZERO, result.totalExpenses());
        assertEquals(4, result.tripsByStatus().size());
        assertEquals(0, result.expensesByCategory().size());
    }
}
