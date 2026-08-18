package com.tripnest.dto;

import java.util.Map;

public class BudgetDTO {
    private Long id;
    private Long tripId;
    private Double totalAmount = 0.0;
    private Double transportationBudget = 0.0;
    private Double hotelBudget = 0.0;
    private Double foodBudget = 0.0;
    private Double shoppingBudget = 0.0;
    private Double entertainmentBudget = 0.0;
    private Double miscBudget = 0.0;
    private String currency = "USD";

    private Double totalSpent = 0.0;
    private Double remainingAmount = 0.0;
    private Double utilizationPercentage = 0.0;
    private Map<String, Double> spentByCategory;

    public BudgetDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Double getTransportationBudget() { return transportationBudget; }
    public void setTransportationBudget(Double transportationBudget) { this.transportationBudget = transportationBudget; }

    public Double getHotelBudget() { return hotelBudget; }
    public void setHotelBudget(Double hotelBudget) { this.hotelBudget = hotelBudget; }

    public Double getFoodBudget() { return foodBudget; }
    public void setFoodBudget(Double foodBudget) { this.foodBudget = foodBudget; }

    public Double getShoppingBudget() { return shoppingBudget; }
    public void setShoppingBudget(Double shoppingBudget) { this.shoppingBudget = shoppingBudget; }

    public Double getEntertainmentBudget() { return entertainmentBudget; }
    public void setEntertainmentBudget(Double entertainmentBudget) { this.entertainmentBudget = entertainmentBudget; }

    public Double getMiscBudget() { return miscBudget; }
    public void setMiscBudget(Double miscBudget) { this.miscBudget = miscBudget; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Double getTotalSpent() { return totalSpent; }
    public void setTotalSpent(Double totalSpent) { this.totalSpent = totalSpent; }

    public Double getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(Double remainingAmount) { this.remainingAmount = remainingAmount; }

    public Double getUtilizationPercentage() { return utilizationPercentage; }
    public void setUtilizationPercentage(Double utilizationPercentage) { this.utilizationPercentage = utilizationPercentage; }

    public Map<String, Double> getSpentByCategory() { return spentByCategory; }
    public void setSpentByCategory(Map<String, Double> spentByCategory) { this.spentByCategory = spentByCategory; }
}
