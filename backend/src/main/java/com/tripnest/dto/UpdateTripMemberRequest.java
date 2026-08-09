package com.tripnest.dto;

import com.tripnest.entity.TripMemberRole;
import jakarta.validation.constraints.NotNull;

public record UpdateTripMemberRequest(@NotNull TripMemberRole role) {
}
