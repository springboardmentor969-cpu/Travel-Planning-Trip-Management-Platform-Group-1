package com.tripnest.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false, unique = true)
    @JsonIgnore
    private Trip trip;

    private Double totalAmount = 0.0;

    private Double transportationBudget = 0.0;

    private Double hotelBudget = 0.0;

    private Double foodBudget = 0.0;

    private Double shoppingBudget = 0.0;

    private Double entertainmentBudget = 0.0;

    private Double miscBudget = 0.0;

    @Column(length = 10)
    private String currency = "USD";

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Budget() {}

    public Budget(Trip trip, Double totalAmount) {
        this.trip = trip;
        this.totalAmount = totalAmount;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
