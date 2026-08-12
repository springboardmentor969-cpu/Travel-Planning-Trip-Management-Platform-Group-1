package com.tripnest.dto;

import com.tripnest.entity.TripMember;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupMemberResponse {
    private Long id;
    private Long userId;
    private String email;
    private String name;
    private String role;
    private String status;
    private LocalDateTime joinedAt;
    private Long tripId;
    private String tripDestination;
    private String invitedBy;

    public static GroupMemberResponse from(TripMember member) {
        String ownerName = null;
        if (member.getTrip() != null && member.getTrip().getOwner() != null) {
            ownerName = member.getTrip().getOwner().getName() != null
                    ? member.getTrip().getOwner().getName()
                    : member.getTrip().getOwner().getEmail();
        }

        return GroupMemberResponse.builder()
                .id(member.getId())
                .userId(member.getUser() != null ? member.getUser().getId() : null)
                .email(member.getEmail())
                .name(member.getName() != null ? member.getName() : member.getEmail())
                .role(member.getRole())
                .status(member.getStatus())
                .joinedAt(member.getJoinedAt())
                .tripId(member.getTrip() != null ? member.getTrip().getId() : null)
                .tripDestination(member.getTrip() != null ? member.getTrip().getDestination() : null)
                .invitedBy(ownerName)
                .build();
    }
}
