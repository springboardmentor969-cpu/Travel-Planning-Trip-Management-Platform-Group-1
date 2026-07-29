package com.tripnest.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.tripnest.entity.ActivityType;
import java.time.LocalTime;


public record ItineraryDto(
        Long id,

        @NotNull(message = "Day number is required")
        Integer dayNumber,

        @NotNull(message = "Activity type is required")
        ActivityType activityType,

        @Size(max = 140, message = "Title must be less than 140 characters")
        @NotNull(message = "Title is required")
        String title,

        @Size(max = 1000, message = "Description must be less than 1000 characters")
        String description,

        String location,
        LocalTime time,
        Long tripId
) {
}
