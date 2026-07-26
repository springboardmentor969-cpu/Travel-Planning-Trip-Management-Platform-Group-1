package com.tripnest.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReorderRequest {

    @NotNull(message = "New position is required")
    private Integer sortOrder;

    // Optional: move the activity to a different day within the same trip
    private Long targetDayId;
}