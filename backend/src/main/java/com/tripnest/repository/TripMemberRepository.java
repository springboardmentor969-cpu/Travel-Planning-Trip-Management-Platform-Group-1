package com.tripnest.repository;

import com.tripnest.entity.Trip;
import com.tripnest.entity.TripMember;
import com.tripnest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripMemberRepository extends JpaRepository<TripMember, Long> {
    List<TripMember> findByTrip(Trip trip);
    List<TripMember> findByUserAndInviteStatus(User user, TripMember.InviteStatus status);
    Optional<TripMember> findByTripAndUser(Trip trip, User user);
    boolean existsByTripAndUser(Trip trip, User user);
    void deleteByTripAndUser(Trip trip, User user);
}
