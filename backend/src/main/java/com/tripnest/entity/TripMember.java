package com.tripnest.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip_members", uniqueConstraints = {
    @UniqueConstraint(name = "uk_trip_user_member", columnNames = {"trip_id", "user_id"})
}, indexes = {
    @Index(name = "idx_member_trip", columnList = "trip_id"),
    @Index(name = "idx_member_user", columnList = "user_id")
})
public class TripMember {

    public enum GroupRole {
        GROUP_ADMIN,
        MEMBER
    }

    public enum InviteStatus {
        PENDING,
        ACCEPTED,
        REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    @JsonIgnore
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private GroupRole groupRole = GroupRole.MEMBER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InviteStatus inviteStatus = InviteStatus.PENDING;

    @Column(nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    public TripMember() {}

    public TripMember(Trip trip, User user, GroupRole groupRole, InviteStatus inviteStatus) {
        this.trip = trip;
        this.user = user;
        this.groupRole = groupRole != null ? groupRole : GroupRole.MEMBER;
        this.inviteStatus = inviteStatus != null ? inviteStatus : InviteStatus.PENDING;
    }

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public GroupRole getGroupRole() { return groupRole; }
    public void setGroupRole(GroupRole groupRole) { this.groupRole = groupRole; }

    public InviteStatus getInviteStatus() { return inviteStatus; }
    public void setInviteStatus(InviteStatus inviteStatus) { this.inviteStatus = inviteStatus; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}
