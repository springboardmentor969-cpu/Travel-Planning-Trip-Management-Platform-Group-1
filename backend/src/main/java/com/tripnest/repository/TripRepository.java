package com.tripnest.repository;

import com.tripnest.entity.Trip;
import com.tripnest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByOwnerOrderByStartDateAsc(User owner);
    
    @Query("SELECT DISTINCT t FROM Trip t LEFT JOIN t.members m WHERE t.owner = :user OR (m.user = :user AND m.inviteStatus = 'ACCEPTED') ORDER BY t.startDate ASC")
    List<Trip> findAllAccessibleByUser(@Param("user") User user);

    Optional<Trip> findByShareCode(String shareCode);

    List<Trip> findByStatus(Trip.TripStatus status);

    long countByStatus(Trip.TripStatus status);

    @Query("SELECT t.destination, COUNT(t) FROM Trip t GROUP BY t.destination ORDER BY COUNT(t) DESC")
    List<Object[]> findPopularTripDestinations();
}
