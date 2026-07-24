package com.tripnest.repository;

import com.tripnest.entity.Trip;
import com.tripnest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip, Long> {

    // Trips owned by the user
    List<Trip> findByOwner(User owner);

    // All trips visible to a user (owner + collaborators)
    @Query("""
        SELECT DISTINCT t
        FROM Trip t
        LEFT JOIN t.collaborators c
        WHERE t.owner = :user OR c = :user
        ORDER BY t.startDate ASC
    """)
    List<Trip> findAllVisibleToUser(@Param("user") User user);

    // Find a trip owned by a specific user
    Optional<Trip> findByIdAndOwner(Long id, User owner);

    // Search trips by destination
    List<Trip> findByDestinationIgnoreCase(String destination);

    // Search trips by status
    List<Trip> findByStatus(com.tripnest.entity.TripStatus status);

    // Favourite trips
    List<Trip> findByOwnerAndFavouriteTrue(User owner);
}