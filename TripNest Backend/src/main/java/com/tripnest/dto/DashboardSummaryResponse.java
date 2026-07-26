package com.tripnest.dto;

import java.util.List;

public class DashboardSummaryResponse {

    private List<TripResponse> upcomingTrips;
    private BudgetOverview budgetOverview;
    private ExpenseSummary expenseSummary;
    private TravelStats travelStats;
    private List<Object> favoriteDestinations;

    public DashboardSummaryResponse() {}

    public DashboardSummaryResponse(List<TripResponse> upcomingTrips, BudgetOverview budgetOverview, ExpenseSummary expenseSummary, TravelStats travelStats, List<Object> favoriteDestinations) {
        this.upcomingTrips = upcomingTrips;
        this.budgetOverview = budgetOverview;
        this.expenseSummary = expenseSummary;
        this.travelStats = travelStats;
        this.favoriteDestinations = favoriteDestinations;
    }

    public static DashboardSummaryResponseBuilder builder() {
        return new DashboardSummaryResponseBuilder();
    }

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
            return new DashboardSummaryResponse(upcomingTrips, budgetOverview, expenseSummary, travelStats, favoriteDestinations);
        }
    }

    public static class BudgetOverview {
        private Double totalPlanned;

        public BudgetOverview() {}
        public BudgetOverview(Double totalPlanned) { this.totalPlanned = totalPlanned; }

        public static BudgetOverviewBuilder builder() { return new BudgetOverviewBuilder(); }

        public Double getTotalPlanned() { return totalPlanned; }
        public void setTotalPlanned(Double totalPlanned) { this.totalPlanned = totalPlanned; }

        public static class BudgetOverviewBuilder {
            private Double totalPlanned;
            public BudgetOverviewBuilder totalPlanned(Double totalPlanned) { this.totalPlanned = totalPlanned; return this; }
            public BudgetOverview build() { return new BudgetOverview(totalPlanned); }
        }
    }

    public static class ExpenseSummary {
        private Double totalSpent;

        public ExpenseSummary() {}
        public ExpenseSummary(Double totalSpent) { this.totalSpent = totalSpent; }

        public static ExpenseSummaryBuilder builder() { return new ExpenseSummaryBuilder(); }

        public Double getTotalSpent() { return totalSpent; }
        public void setTotalSpent(Double totalSpent) { this.totalSpent = totalSpent; }

        public static class ExpenseSummaryBuilder {
            private Double totalSpent;
            public ExpenseSummaryBuilder totalSpent(Double totalSpent) { this.totalSpent = totalSpent; return this; }
            public ExpenseSummary build() { return new ExpenseSummary(totalSpent); }
        }
    }

    public static class TravelStats {
        private Long totalTrips;
        private Integer countriesVisited;
        private Integer totalDaysTravelled;

        public TravelStats() {}
        public TravelStats(Long totalTrips, Integer countriesVisited, Integer totalDaysTravelled) {
            this.totalTrips = totalTrips;
            this.countriesVisited = countriesVisited;
            this.totalDaysTravelled = totalDaysTravelled;
        }

        public static TravelStatsBuilder builder() { return new TravelStatsBuilder(); }

        public Long getTotalTrips() { return totalTrips; }
        public void setTotalTrips(Long totalTrips) { this.totalTrips = totalTrips; }

        public Integer getCountriesVisited() { return countriesVisited; }
        public void setCountriesVisited(Integer countriesVisited) { this.countriesVisited = countriesVisited; }

        public Integer getTotalDaysTravelled() { return totalDaysTravelled; }
        public void setTotalDaysTravelled(Integer totalDaysTravelled) { this.totalDaysTravelled = totalDaysTravelled; }

        public static class TravelStatsBuilder {
            private Long totalTrips;
            private Integer countriesVisited;
            private Integer totalDaysTravelled;

            public TravelStatsBuilder totalTrips(Long totalTrips) { this.totalTrips = totalTrips; return this; }
            public TravelStatsBuilder countriesVisited(Integer countriesVisited) { this.countriesVisited = countriesVisited; return this; }
            public TravelStatsBuilder totalDaysTravelled(Integer totalDaysTravelled) { this.totalDaysTravelled = totalDaysTravelled; return this; }

            public TravelStats build() { return new TravelStats(totalTrips, countriesVisited, totalDaysTravelled); }
        }
    }
}