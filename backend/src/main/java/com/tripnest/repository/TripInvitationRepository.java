package com.tripnest.repository;

import com.tripnest.entity.InvitationStatus;
import com.tripnest.entity.TripInvitation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripInvitationRepository extends JpaRepository<TripInvitation, Long> {
    List<TripInvitation> findByInviteeEmailAndStatusOrderByCreatedAtDesc(String inviteeEmail, InvitationStatus status);

    List<TripInvitation> findByTripIdOrderByCreatedAtDesc(Long tripId);

    boolean existsByTripIdAndInviteeEmailAndStatus(Long tripId, String inviteeEmail, InvitationStatus status);
}