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

    public List<TripResponse> getUpcomingTrips() { return upcomingTrips; }
    public void setUpcomingTrips(List<TripResponse> upcomingTrips) { this.upcomingTrips = upcomingTrips; }

    public BudgetOverview getBudgetOverview() { return budgetOverview; }
    public void setBudgetOverview(BudgetOverview budgetOverview) { this.budgetOverview = budgetOverview; }

    public ExpenseSummary getExpenseSummary() { return expenseSummary; }
    public void setExpenseSummary(ExpenseSummary expenseSummary) { this.expenseSummary = expenseSummary; }

    public TravelStats getTravelStats() { return travelStats; }
    public void setTravelStats(TravelStats travelStats) { this.travelStats = travelStats; }

    public List<Object> getFavoriteDestinations() { return favoriteDestinations; }
    public void setFavoriteDestinations(List<Object> favoriteDestinations) { this.favoriteDestinations = favoriteDestinations; }

    public static DashboardSummaryResponseBuilder builder() {
        return new DashboardSummaryResponseBuilder();
    }

    public static class DashboardSummaryResponseBuilder {
        private List<TripResponse> upcomingTrips;
        private BudgetOverview budgetOverview;
        private ExpenseSummary expenseSummary;
        private TravelStats travelStats;
        private List<Object> favoriteDestinations;

        public DashboardSummaryResponseBuilder upcomingTrips(List<TripResponse> upcomingTrips) { this.upcomingTrips = upcomingTrips; return this; }
        public DashboardSummaryResponseBuilder budgetOverview(BudgetOverview budgetOverview) { this.budgetOverview = budgetOverview; return this; }
        public DashboardSummaryResponseBuilder expenseSummary(ExpenseSummary expenseSummary) { this.expenseSummary = expenseSummary; return this; }
        public DashboardSummaryResponseBuilder travelStats(TravelStats travelStats) { this.travelStats = travelStats; return this; }
        public DashboardSummaryResponseBuilder favoriteDestinations(List<Object> favoriteDestinations) { this.favoriteDestinations = favoriteDestinations; return this; }

        public DashboardSummaryResponse build() {
            DashboardSummaryResponse d = new DashboardSummaryResponse();
            d.setUpcomingTrips(upcomingTrips);
            d.setBudgetOverview(budgetOverview);
            d.setExpenseSummary(expenseSummary);
            d.setTravelStats(travelStats);
            d.setFavoriteDestinations(favoriteDestinations);
            return d;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BudgetOverview {
        private Double totalPlanned;

        public Double getTotalPlanned() { return totalPlanned; }
        public void setTotalPlanned(Double totalPlanned) { this.totalPlanned = totalPlanned; }

        public static BudgetOverviewBuilder builder() {
            return new BudgetOverviewBuilder();
        }

        public static class BudgetOverviewBuilder {
            private Double totalPlanned;
            public BudgetOverviewBuilder totalPlanned(Double totalPlanned) { this.totalPlanned = totalPlanned; return this; }
            public BudgetOverview build() {
                BudgetOverview b = new BudgetOverview();
                b.setTotalPlanned(totalPlanned);
                return b;
            }
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExpenseSummary {
        private Double totalSpent;

        public Double getTotalSpent() { return totalSpent; }
        public void setTotalSpent(Double totalSpent) { this.totalSpent = totalSpent; }

        public static ExpenseSummaryBuilder builder() {
            return new ExpenseSummaryBuilder();
        }

        public static class ExpenseSummaryBuilder {
            private Double totalSpent;
            public ExpenseSummaryBuilder totalSpent(Double totalSpent) { this.totalSpent = totalSpent; return this; }
            public ExpenseSummary build() {
                ExpenseSummary e = new ExpenseSummary();
                e.setTotalSpent(totalSpent);
                return e;
            }
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TravelStats {
        private Long totalTrips;
        private Integer countriesVisited;
        private Integer totalDaysTravelled;

        public Long getTotalTrips() { return totalTrips; }
        public void setTotalTrips(Long totalTrips) { this.totalTrips = totalTrips; }

        public Integer getCountriesVisited() { return countriesVisited; }
        public void setCountriesVisited(Integer countriesVisited) { this.countriesVisited = countriesVisited; }

        public Integer getTotalDaysTravelled() { return totalDaysTravelled; }
        public void setTotalDaysTravelled(Integer totalDaysTravelled) { this.totalDaysTravelled = totalDaysTravelled; }

        public static TravelStatsBuilder builder() {
            return new TravelStatsBuilder();
        }

        public static class TravelStatsBuilder {
            private Long totalTrips;
            private Integer countriesVisited;
            private Integer totalDaysTravelled;

            public TravelStatsBuilder totalTrips(Long totalTrips) { this.totalTrips = totalTrips; return this; }
            public TravelStatsBuilder countriesVisited(Integer countriesVisited) { this.countriesVisited = countriesVisited; return this; }
            public TravelStatsBuilder totalDaysTravelled(Integer totalDaysTravelled) { this.totalDaysTravelled = totalDaysTravelled; return this; }

            public TravelStats build() {
                TravelStats t = new TravelStats();
                t.setTotalTrips(totalTrips);
                t.setCountriesVisited(countriesVisited);
                t.setTotalDaysTravelled(totalDaysTravelled);
                return t;
            }
        }
    }
}