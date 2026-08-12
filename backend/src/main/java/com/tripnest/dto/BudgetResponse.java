package com.tripnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetResponse {
    private Double totalBudget;
    private Double totalSpent;
    private Double remaining;
    private Map<String, Double> categoryBreakdown;
    private List<CategoryExpenseSummary> byCategory;
}
