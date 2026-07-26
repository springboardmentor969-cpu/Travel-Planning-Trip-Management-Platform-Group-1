package com.tripnest.dto;

import com.tripnest.entity.ItineraryDay;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryDayResponse {

    private Long id;
    private Integer dayNumber;
    private LocalDate date;
    private List<ActivityResponse> activities;

    public static ItineraryDayResponse from(ItineraryDay day) {
        return ItineraryDayResponse.builder()
                .id(day.getId())
                .dayNumber(day.getDayNumber())
                .date(day.getDate())
                .activities(day.getActivities().stream()
                        .map(ActivityResponse::from)
                        .toList())
                .build();
    }
}