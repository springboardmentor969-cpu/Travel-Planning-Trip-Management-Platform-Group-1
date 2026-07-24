package com.tripnest.dto;

import lombok.Data;

import java.time.LocalTime;

@Data
public class UpdateActivityRequest {
    // All optional - only non-null fields get applied
    private Integer dayNumber;
    private LocalTime time;
    private String name;
    private String type;
    private String location;
    private String notes;
    private Integer reminderMinutesBefore;
}
