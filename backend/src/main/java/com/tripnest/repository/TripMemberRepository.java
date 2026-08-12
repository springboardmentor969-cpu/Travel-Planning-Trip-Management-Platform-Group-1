package com.tripnest.repository;

import com.tripnest.entity.TripMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripMemberRepository extends JpaRepository<TripMember, Long> {
    List<TripMember> findByTripId(Long tripId);
    Optional<TripMember> findByTripIdAndId(Long tripId, Long id);
    boolean existsByTripIdAndEmailIgnoreCase(Long tripId, String email);
    Optional<TripMember> findByTripIdAndEmailIgnoreCase(Long tripId, String email);
    boolean existsByTripIdAndUserId(Long tripId, Long userId);
    boolean existsByTripIdAndUserIdAndStatus(Long tripId, Long userId, String status);
    boolean existsByTripIdAndEmailIgnoreCaseAndStatus(Long tripId, String email, String status);
    List<TripMember> findByUserIdAndStatus(Long userId, String status);
    List<TripMember> findByEmailIgnoreCaseAndStatus(String email, String status);
    Optional<TripMember> findByTripIdAndUserId(Long tripId, Long userId);
}

