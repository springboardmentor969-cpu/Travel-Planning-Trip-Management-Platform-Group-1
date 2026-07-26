package com.tripnest.repository;

import com.tripnest.entity.Trip;
import com.tripnest.entity.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByOwnerIdOrderByStartDateAsc(Long ownerId);

    List<Trip> findByOwnerIdAndStatusOrderByStartDateAsc(Long ownerId, TripStatus status);

    List<Trip> findByOwnerIdAndDestinationContainingIgnoreCaseOrderByStartDateAsc(
            Long ownerId, String destination);

    long countByOwnerId(Long ownerId);

    List<Trip> findByOwnerIdAndStatusInAndStartDateGreaterThanEqualOrderByStartDateAsc(
            Long ownerId, List<TripStatus> statuses, LocalDate from);
}
