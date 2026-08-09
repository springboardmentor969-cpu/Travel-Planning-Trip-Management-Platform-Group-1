package com.tripnest.repository;

import com.tripnest.entity.TripMember;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripMemberRepository extends JpaRepository<TripMember, Long> {
    List<TripMember> findByTripIdOrderByAddedAtAsc(Long tripId);
    Optional<TripMember> findByTripIdAndUserId(Long tripId, Long userId);
    boolean existsByTripIdAndUserId(Long tripId, Long userId);
    List<TripMember> findByUserId(Long userId);
}
