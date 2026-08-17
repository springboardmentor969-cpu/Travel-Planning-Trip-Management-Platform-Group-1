package com.tripnest.dto;

import java.math.BigDecimal;
import java.util.List;

public record AdminAnalyticsDto(
        long totalUsers,
        long totalTrips,
        BigDecimal totalExpenses,
        List<ChartDataPointDto> tripsByStatus,
        List<ChartDataPointDto> expensesByCategory,
        List<ChartDataPointDto> monthlyExpenses
) {
}
