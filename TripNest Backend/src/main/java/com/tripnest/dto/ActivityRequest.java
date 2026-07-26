package com.tripnest.dto;

import com.tripnest.entity.ActivityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ActivityRequest {

    @NotBlank(message = "Activity title is required")
    private String title;

    @NotNull(message = "Activity type is required")
    private ActivityType type;

    private String place;

    private String startTime;

    private String endTime;

    private String notes;

    private Boolean reminder;
}