package com.tripnest.service;

import com.tripnest.dto.TripDTO;
import com.tripnest.entity.*;
import com.tripnest.exception.BadRequestException;
import com.tripnest.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TripServiceTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private ItineraryRepository itineraryRepository;

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private TripMemberRepository tripMemberRepository;

    @Mock
    private ActivityRepository activityRepository;

    @InjectMocks
    private TripService tripService;

    private User user;
    private TripDTO tripDTO;

    @BeforeEach
    void setUp() {
        user = new User("traveler@tripnest.com", "hash", "Maya Lin", Role.ROLE_TRAVELER);
        user.setId(1L);

        tripDTO = new TripDTO();
        tripDTO.setTitle("Alpine Adventure");
        tripDTO.setDestination("Swiss Alps, Switzerland");
        tripDTO.setStartDate(LocalDate.of(2026, 9, 1));
        tripDTO.setEndDate(LocalDate.of(2026, 9, 5));
        tripDTO.setTotalBudget(2000.0);
    }

    @Test
    void testCreateTrip_Success() {
        Trip trip = new Trip();
        trip.setId(100L);
        trip.setTitle(tripDTO.getTitle());
        trip.setDestination(tripDTO.getDestination());
        trip.setStartDate(tripDTO.getStartDate());
        trip.setEndDate(tripDTO.getEndDate());
        trip.setTotalBudget(tripDTO.getTotalBudget());
        trip.setOwner(user);

        when(tripRepository.save(any(Trip.class))).thenReturn(trip);
        when(tripRepository.findById(100L)).thenReturn(Optional.of(trip));
        when(expenseRepository.sumAmountByTrip(any())).thenReturn(0.0);
        when(tripMemberRepository.findByTrip(any())).thenReturn(Collections.emptyList());
        when(itineraryRepository.findByTripOrderByDayNumberAsc(any())).thenReturn(Collections.emptyList());

        TripDTO result = tripService.createTrip(tripDTO, user);

        assertNotNull(result);
        assertEquals("Alpine Adventure", result.getTitle());
        assertEquals("Swiss Alps, Switzerland", result.getDestination());
        verify(budgetRepository, times(1)).save(any(Budget.class));
        verify(itineraryRepository, times(5)).save(any(Itinerary.class)); // 5 days generated
        verify(tripMemberRepository, times(1)).save(any(TripMember.class));
    }

    @Test
    void testCreateTrip_InvalidDates_ThrowsBadRequest() {
        tripDTO.setStartDate(LocalDate.of(2026, 9, 10));
        tripDTO.setEndDate(LocalDate.of(2026, 9, 1));

        assertThrows(BadRequestException.class, () -> tripService.createTrip(tripDTO, user));
        verify(tripRepository, never()).save(any());
    }
}
