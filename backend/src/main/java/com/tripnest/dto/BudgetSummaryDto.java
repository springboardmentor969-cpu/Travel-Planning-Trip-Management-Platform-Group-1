package com.tripnest.dto;

import java.math.BigDecimal;

public record BudgetSummaryDto(
        Long tripId,
        String tripTitle,
        BigDecimal budget,
        BigDecimal totalExpenses,
        BigDecimal remainingAmount
) {
}
