package com.tripnest.dto;

import com.tripnest.entity.TripMemberRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AddTripMemberRequest(@NotBlank @Email String email, TripMemberRole role) {
}
