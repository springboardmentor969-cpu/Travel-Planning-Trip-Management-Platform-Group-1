package com.tripnest.entity;



import jakarta.persistence.*;
import java.time.LocalTime; // ADD THIS

@Entity
@Table(name = "itineraries")
public class Itinerary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private Integer dayNumber; // Day 1, Day 2

    @Column(nullable = false, length = 140)
    private String title; // "Visit Munnar Tea Gardens"

    @Enumerated(EnumType.STRING) // ADD THIS for Activity Types
    @Column(nullable = false, length = 30)
    private ActivityType activityType;

    private String location; // ADD THIS for Place management

    private LocalTime time; // ADD THIS for Activity scheduling/timeline

    @Column(length = 1000)
    private String description; // notes



    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }
    public Integer getDayNumber() { return dayNumber; }
    public void setDayNumber(Integer dayNumber) { this.dayNumber = dayNumber; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public ActivityType getActivityType() { return activityType; }
    public void setActivityType(ActivityType activityType) { this.activityType = activityType; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}