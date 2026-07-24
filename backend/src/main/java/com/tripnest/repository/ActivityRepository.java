package com.tripnest.repository;

import com.tripnest.entity.Activity;
import com.tripnest.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByTripOrderByDayNumberAscTimeAsc(Trip trip);

    List<Activity> findByTripAndDayNumberOrderByTimeAsc(Trip trip, Integer dayNumber);

    Optional<Activity> findByIdAndTrip(Long id, Trip trip);
}
