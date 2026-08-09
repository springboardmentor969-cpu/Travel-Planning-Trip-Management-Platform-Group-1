package com.tripnest.dto;

import com.tripnest.entity.TripMemberRole;
import java.time.Instant;

public record TripMemberDto(Long userId, String name, String email, String role, Instant addedAt) {
    public static TripMemberDto owner(Long userId, String name, String email) {
        return new TripMemberDto(userId, name, email, "OWNER", null);
    }
}
