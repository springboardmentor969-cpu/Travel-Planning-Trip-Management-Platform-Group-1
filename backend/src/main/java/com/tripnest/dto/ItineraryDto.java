package com.tripnest.dto;

import com.tripnest.entity.ActivityType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalTime;

public record ItineraryDto(
        Long id,
        @NotNull @Min(1) Integer dayNumber,
        @NotBlank @Size(max = 140) String title,
        @Size(max = 1000) String description,
        ActivityType activityType,
        LocalTime activityTime,
        Long tripId
) {
}
