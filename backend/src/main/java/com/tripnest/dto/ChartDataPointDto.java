package com.tripnest.dto;

import java.math.BigDecimal;

/** A compact, chart-ready label/value pair. */
public record ChartDataPointDto(String label, BigDecimal value) {
}
