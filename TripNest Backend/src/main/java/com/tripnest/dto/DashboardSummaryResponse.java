package com.tripnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryResponse {

    private List<TripResponse> upcomingTrips;
    private BudgetOverview budgetOverview;
    private ExpenseSummary expenseSummary;
    private TravelStats travelStats;
    private List<Object> favoriteDestinations;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BudgetOverview {
        private Double totalPlanned;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExpenseSummary {
        private Double totalSpent;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TravelStats {
        private Long totalTrips;
        private Integer countriesVisited;
        private Integer totalDaysTravelled;
    }
}