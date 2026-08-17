package com.tripnest.dto;

import java.math.BigDecimal;

public record TripBudgetReportDto(Long tripId, String tripTitle, BigDecimal budget, BigDecimal spent) {
}
