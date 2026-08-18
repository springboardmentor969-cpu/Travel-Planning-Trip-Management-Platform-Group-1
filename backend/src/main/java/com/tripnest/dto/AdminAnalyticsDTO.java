package com.tripnest.dto;

import java.util.List;
import java.util.Map;

public class AdminAnalyticsDTO {
    private long totalUsers;
    private long totalTravelers;
    private long totalAdmins;
    private long totalTrips;
    private long activeTrips;
    private long completedTrips;
    private long totalDestinations;
    private double totalPlatformExpenses;
    private Map<String, Long> tripsByStatus;
    private List<Map<String, Object>> popularDestinations;
    private List<UserProfileDTO> recentUsers;

    public AdminAnalyticsDTO() {}

    // Getters and Setters
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalTravelers() { return totalTravelers; }
    public void setTotalTravelers(long totalTravelers) { this.totalTravelers = totalTravelers; }

    public long getTotalAdmins() { return totalAdmins; }
    public void setTotalAdmins(long totalAdmins) { this.totalAdmins = totalAdmins; }

    public long getTotalTrips() { return totalTrips; }
    public void setTotalTrips(long totalTrips) { this.totalTrips = totalTrips; }

    public long getActiveTrips() { return activeTrips; }
    public void setActiveTrips(long activeTrips) { this.activeTrips = activeTrips; }

    public long getCompletedTrips() { return completedTrips; }
    public void setCompletedTrips(long completedTrips) { this.completedTrips = completedTrips; }

    public long getTotalDestinations() { return totalDestinations; }
    public void setTotalDestinations(long totalDestinations) { this.totalDestinations = totalDestinations; }

    public double getTotalPlatformExpenses() { return totalPlatformExpenses; }
    public void setTotalPlatformExpenses(double totalPlatformExpenses) { this.totalPlatformExpenses = totalPlatformExpenses; }

    public Map<String, Long> getTripsByStatus() { return tripsByStatus; }
    public void setTripsByStatus(Map<String, Long> tripsByStatus) { this.tripsByStatus = tripsByStatus; }

    public List<Map<String, Object>> getPopularDestinations() { return popularDestinations; }
    public void setPopularDestinations(List<Map<String, Object>> popularDestinations) { this.popularDestinations = popularDestinations; }

    public List<UserProfileDTO> getRecentUsers() { return recentUsers; }
    public void setRecentUsers(List<UserProfileDTO> recentUsers) { this.recentUsers = recentUsers; }
}
