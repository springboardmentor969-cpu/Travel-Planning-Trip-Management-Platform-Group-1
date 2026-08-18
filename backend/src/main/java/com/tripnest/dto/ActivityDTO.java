package com.tripnest.dto;

import com.tripnest.entity.Activity;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalTime;

public class ActivityDTO {
    private Long id;
    private Long itineraryId;

    @NotBlank(message = "Activity title is required")
    private String title;

    private Activity.ActivityType activityType = Activity.ActivityType.SIGHTSEEING;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer durationMinutes;
    private String locationName;
    private String address;
    private Double latitude;
    private Double longitude;
    private Double estimatedCost = 0.0;
    private Double actualCost = 0.0;
    private String notes;
    private Integer sequenceOrder = 0;
    private boolean reminderSet = false;

    public ActivityDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getItineraryId() { return itineraryId; }
    public void setItineraryId(Long itineraryId) { this.itineraryId = itineraryId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Activity.ActivityType getActivityType() { return activityType; }
    public void setActivityType(Activity.ActivityType activityType) { this.activityType = activityType; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }

    public Double getActualCost() { return actualCost; }
    public void setActualCost(Double actualCost) { this.actualCost = actualCost; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getSequenceOrder() { return sequenceOrder; }
    public void setSequenceOrder(Integer sequenceOrder) { this.sequenceOrder = sequenceOrder; }

    public boolean isReminderSet() { return reminderSet; }
    public void setReminderSet(boolean reminderSet) { this.reminderSet = reminderSet; }
}
