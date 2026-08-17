package com.tripnest.dto;

import java.math.BigDecimal;
import java.util.List;

public record UserAnalyticsDto(
        BigDecimal totalBudget,
        BigDecimal totalSpent,
        List<ChartDataPointDto> expensesByCategory,
        List<ChartDataPointDto> monthlyExpenses,
        List<TripBudgetReportDto> tripBudgets
) {
}
