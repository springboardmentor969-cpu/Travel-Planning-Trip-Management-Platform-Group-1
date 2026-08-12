package com.tripnest.repository;

import com.tripnest.entity.TripExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripExpenseRepository extends JpaRepository<TripExpense, Long> {
    List<TripExpense> findByTripIdOrderByDateDesc(Long tripId);
    void deleteByTripIdAndId(Long tripId, Long id);
    List<TripExpense> findByTripIdIn(List<Long> tripIds);
    List<TripExpense> findByTripOwnerId(Long ownerId);
}
