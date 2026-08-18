package com.tripnest.dto;

import java.util.List;
import java.util.Map;

public class TravelerAnalyticsDTO {
    private int totalTrips;
    private int upcomingTrips;
    private int activeTrips;
    private int completedTrips;
    private int daysTraveled;
    private int countriesVisited;
    private double totalBudgetSpent;
    private double totalBudgetPlanned;
    private Map<String, Double> expensesByCategory;
    private Map<String, Double> spendingByMonth;
    private Map<String, Integer> tripsByStatus;
    private List<String> topDestinations;

    public TravelerAnalyticsDTO() {}

    // Getters and Setters
    public int getTotalTrips() { return totalTrips; }
    public void setTotalTrips(int totalTrips) { this.totalTrips = totalTrips; }

    public int getUpcomingTrips() { return upcomingTrips; }
    public void setUpcomingTrips(int upcomingTrips) { this.upcomingTrips = upcomingTrips; }

    public int getActiveTrips() { return activeTrips; }
    public void setActiveTrips(int activeTrips) { this.activeTrips = activeTrips; }

    public int getCompletedTrips() { return completedTrips; }
    public void setCompletedTrips(int completedTrips) { this.completedTrips = completedTrips; }

    public int getDaysTraveled() { return daysTraveled; }
    public void setDaysTraveled(int daysTraveled) { this.daysTraveled = daysTraveled; }

    public int getCountriesVisited() { return countriesVisited; }
    public void setCountriesVisited(int countriesVisited) { this.countriesVisited = countriesVisited; }

    public double getTotalBudgetSpent() { return totalBudgetSpent; }
    public void setTotalBudgetSpent(double totalBudgetSpent) { this.totalBudgetSpent = totalBudgetSpent; }

    public double getTotalBudgetPlanned() { return totalBudgetPlanned; }
    public void setTotalBudgetPlanned(double totalBudgetPlanned) { this.totalBudgetPlanned = totalBudgetPlanned; }

    public Map<String, Double> getExpensesByCategory() { return expensesByCategory; }
    public void setExpensesByCategory(Map<String, Double> expensesByCategory) { this.expensesByCategory = expensesByCategory; }

    public Map<String, Double> getSpendingByMonth() { return spendingByMonth; }
    public void setSpendingByMonth(Map<String, Double> spendingByMonth) { this.spendingByMonth = spendingByMonth; }

    public Map<String, Integer> getTripsByStatus() { return tripsByStatus; }
    public void setTripsByStatus(Map<String, Integer> tripsByStatus) { this.tripsByStatus = tripsByStatus; }

    public List<String> getTopDestinations() { return topDestinations; }
    public void setTopDestinations(List<String> topDestinations) { this.topDestinations = topDestinations; }
}
