package com.tripnest.service;

import com.tripnest.dto.TripDetailsDto;
import com.tripnest.dto.TripDto;
import com.tripnest.entity.Trip;
import com.tripnest.entity.User;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.mapper.ExpenseMapper;
import com.tripnest.mapper.ItineraryMapper;
import com.tripnest.mapper.TripMapper;
import com.tripnest.repository.ExpenseRepository;
import com.tripnest.repository.ItineraryRepository;
import com.tripnest.repository.TripRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TripService {
    private final TripRepository tripRepository;
    private final ItineraryRepository itineraryRepository;
    private final ExpenseRepository expenseRepository;
    private final UserService userService;
    private final BudgetService budgetService;

    public TripService(
            TripRepository tripRepository,
            ItineraryRepository itineraryRepository,
            ExpenseRepository expenseRepository,
            UserService userService,
            BudgetService budgetService
    ) {
        this.tripRepository = tripRepository;
        this.itineraryRepository = itineraryRepository;
        this.expenseRepository = expenseRepository;
        this.userService = userService;
        this.budgetService = budgetService;
    }

    public TripDto create(TripDto dto) {
        validateDates(dto);
        User user = userService.getCurrentUser();
        Trip trip = new Trip();
        TripMapper.updateEntity(trip, dto);
        trip.setUser(user);
        return TripMapper.toDto(tripRepository.save(trip));
    }

    @Transactional(readOnly = true)
    public List<TripDto> list(Long userId) {
        List<Trip> trips = tripRepository.findByUserIdOrderByStartDateAsc(userService.getCurrentUser().getId());
        return trips.stream().map(TripMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public TripDto get(Long id) {
        return TripMapper.toDto(findOwnedEntity(id));
    }

    @Transactional(readOnly = true)
    public TripDetailsDto getDetails(Long id) {
        Trip trip = findOwnedEntity(id);
        return new TripDetailsDto(
                TripMapper.toDto(trip),
                itineraryRepository.findByTripIdOrderByDayNumberAscIdAsc(id).stream().map(ItineraryMapper::toDto).toList(),
                expenseRepository.findByTripIdOrderByExpenseDateDescIdDesc(id).stream().map(ExpenseMapper::toDto).toList(),
                budgetService.getSummary(id)
        );
    }

    public TripDto update(Long id, TripDto dto) {
        validateDates(dto);
        Trip trip = findOwnedEntity(id);
        TripMapper.updateEntity(trip, dto);
        return TripMapper.toDto(tripRepository.save(trip));
    }

    public void delete(Long id) {
        Trip trip = findOwnedEntity(id);
        tripRepository.delete(trip);
    }

    public Trip findEntity(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + id));
    }

    public Trip findOwnedEntity(Long id) {
        Trip trip = findEntity(id);
        if (!trip.getUser().getId().equals(userService.getCurrentUser().getId())) {
            throw new ResourceNotFoundException("Trip not found with id " + id);
        }
        return trip;
    }

    private void validateDates(TripDto dto) {
        if (dto.endDate().isBefore(dto.startDate())) {
            throw new IllegalArgumentException("End date must be on or after start date");
        }
    }
}
