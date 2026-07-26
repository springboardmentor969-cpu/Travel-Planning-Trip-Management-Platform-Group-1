package com.tripnest.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardDto(
        long numberOfTrips,
        List<TripDto> upcomingTrips,
        BigDecimal totalExpenses,
        BigDecimal budgetRemaining
) {
}
