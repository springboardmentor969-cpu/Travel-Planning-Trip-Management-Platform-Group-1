package com.tripnest.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class CreateActivityRequest {

    @NotNull(message = "Day number is required (1 = first day of the trip)")
    @Min(value = 1, message = "Day number must be 1 or greater")
    private Integer dayNumber;

    private LocalTime time;

    @NotBlank(message = "Activity name is required")
    private String name;

    @NotBlank(message = "Activity type is required")
    private String type; // SIGHTSEEING, TRANSPORTATION, ACCOMMODATION, DINING, ADVENTURE, SHOPPING

    private String location;
    private String notes;
    private Integer reminderMinutesBefore;
}
