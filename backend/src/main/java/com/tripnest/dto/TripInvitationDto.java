package com.tripnest.dto;

import com.tripnest.entity.InvitationStatus;
import java.time.LocalDateTime;

public record TripInvitationDto(
        Long id,
        Long tripId,
        String tripTitle,
        String tripDestination,
        String inviteeEmail,
        String invitedByName,
        String invitedByEmail,
        InvitationStatus status,
        LocalDateTime createdAt,
        LocalDateTime respondedAt
) {
}