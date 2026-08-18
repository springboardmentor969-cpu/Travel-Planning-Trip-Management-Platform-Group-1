package com.tripnest.dto;

import com.tripnest.entity.TripMember;
import java.time.LocalDateTime;

public class TripMemberDTO {
    private Long id;
    private Long tripId;
    private Long userId;
    private String fullName;
    private String email;
    private String avatarUrl;
    private TripMember.GroupRole groupRole;
    private TripMember.InviteStatus inviteStatus;
    private LocalDateTime joinedAt;

    public TripMemberDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public TripMember.GroupRole getGroupRole() { return groupRole; }
    public void setGroupRole(TripMember.GroupRole groupRole) { this.groupRole = groupRole; }

    public TripMember.InviteStatus getInviteStatus() { return inviteStatus; }
    public void setInviteStatus(TripMember.InviteStatus inviteStatus) { this.inviteStatus = inviteStatus; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}
