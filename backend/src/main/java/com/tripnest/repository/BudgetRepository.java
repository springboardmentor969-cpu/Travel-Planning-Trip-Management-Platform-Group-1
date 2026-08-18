package com.tripnest.repository;

import com.tripnest.entity.Budget;
import com.tripnest.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    Optional<Budget> findByTrip(Trip trip);
    void deleteByTrip(Trip trip);
}
