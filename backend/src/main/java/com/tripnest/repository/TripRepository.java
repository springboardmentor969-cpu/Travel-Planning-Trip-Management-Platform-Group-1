package com.tripnest.repository;

import com.tripnest.entity.Trip;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUserIdOrderByStartDateAsc(Long userId);

    List<Trip> findTop5ByStartDateGreaterThanEqualOrderByStartDateAsc(LocalDate date);

    List<Trip> findTop5ByUserIdAndStartDateGreaterThanEqualOrderByStartDateAsc(Long userId, LocalDate date);

    long countByUserId(Long userId);
}
