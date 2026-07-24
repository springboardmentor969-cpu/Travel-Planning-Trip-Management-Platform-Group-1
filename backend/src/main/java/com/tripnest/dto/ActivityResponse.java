package com.tripnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponse {
    private Long id;
    private Integer dayNumber;
    private LocalTime time;
    private String name;
    private String type;
    private String location;
    private String notes;
    private Integer reminderMinutesBefore;
    private String createdByName;
}
