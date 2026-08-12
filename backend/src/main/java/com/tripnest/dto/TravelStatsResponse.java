package com.tripnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelStatsResponse {
    private long totalTrips;
    private int countriesVisited;
    private int totalDaysTravelled;
}
