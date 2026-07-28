package com.tripnest.service;

import com.tripnest.dto.ExpenseDto;
import com.tripnest.entity.Expense;
import com.tripnest.entity.Trip;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.mapper.ExpenseMapper;
import com.tripnest.repository.ExpenseRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final TripService tripService;

    public ExpenseService(ExpenseRepository expenseRepository, TripService tripService) {
        this.expenseRepository = expenseRepository;
        this.tripService = tripService;
    }

    public ExpenseDto create(Long tripId, ExpenseDto dto) {
        Trip trip = tripService.findOwnedEntity(tripId);
        Expense expense = new Expense();
        ExpenseMapper.updateEntity(expense, dto);
        expense.setTrip(trip);
        return ExpenseMapper.toDto(expenseRepository.save(expense));
    }

    @Transactional(readOnly = true)
    public List<ExpenseDto> list(Long tripId) {
        tripService.findOwnedEntity(tripId);
        return expenseRepository.findByTripIdOrderByExpenseDateDescIdDesc(tripId).stream()
                .map(ExpenseMapper::toDto)
                .toList();
    }

    public ExpenseDto update(Long tripId, Long expenseId, ExpenseDto dto) {
        Expense expense = findOwned(tripId, expenseId);
        ExpenseMapper.updateEntity(expense, dto);
        return ExpenseMapper.toDto(expenseRepository.save(expense));
    }

    public void delete(Long tripId, Long expenseId) {
        expenseRepository.delete(findOwned(tripId, expenseId));
    }

    private Expense findOwned(Long tripId, Long expenseId) {
        tripService.findOwnedEntity(tripId);
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id " + expenseId));
        if (!expense.getTrip().getId().equals(tripId)) {
            throw new ResourceNotFoundException("Expense does not belong to trip " + tripId);
        }
        return expense;
    }
}
