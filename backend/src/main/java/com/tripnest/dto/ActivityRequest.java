package com.tripnest.dto;

import com.tripnest.entity.ActivityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ActivityRequest {

    @NotBlank(message = "Activity title is required")
    private String title;

    @NotNull(message = "Activity type is required")
    private ActivityType type;

    private String place;

    private String startTime;

    private String endTime;

    private String notes;

    private Boolean reminder;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public ActivityType getType() { return type; }
    public void setType(ActivityType type) { this.type = type; }

    public String getPlace() { return place; }
    public void setPlace(String place) { this.place = place; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Boolean getReminder() { return reminder; }
    public void setReminder(Boolean reminder) { this.reminder = reminder; }
}