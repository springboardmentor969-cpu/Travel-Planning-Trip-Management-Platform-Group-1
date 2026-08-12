package com.tripnest.repository;

import com.tripnest.entity.Trip;
import com.tripnest.entity.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query("SELECT DISTINCT t FROM Trip t LEFT JOIN TripMember tm ON tm.trip = t " +
           "WHERE t.owner.id = :userId OR ((tm.user.id = :userId OR tm.email = :email) AND tm.status = 'ACCEPTED') " +
           "ORDER BY t.startDate ASC")
    List<Trip> findAllAccessibleTrips(@Param("userId") Long userId, @Param("email") String email);
}
