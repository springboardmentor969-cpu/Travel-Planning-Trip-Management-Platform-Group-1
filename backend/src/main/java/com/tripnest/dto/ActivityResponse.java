package com.tripnest.dto;

import com.tripnest.entity.Activity;
import com.tripnest.entity.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityResponse {

    private Long id;
    private String title;
    private ActivityType type;
    private String place;
    private String startTime;
    private String endTime;
    private String notes;
    private Boolean reminder;
    private Integer sortOrder;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    public static ActivityResponseBuilder builder() {
        return new ActivityResponseBuilder();
    }

    public static class ActivityResponseBuilder {
        private Long id;
        private String title;
        private ActivityType type;
        private String place;
        private String startTime;
        private String endTime;
        private String notes;
        private Boolean reminder;
        private Integer sortOrder;

        public ActivityResponseBuilder id(Long id) { this.id = id; return this; }
        public ActivityResponseBuilder title(String title) { this.title = title; return this; }
        public ActivityResponseBuilder type(ActivityType type) { this.type = type; return this; }
        public ActivityResponseBuilder place(String place) { this.place = place; return this; }
        public ActivityResponseBuilder startTime(String startTime) { this.startTime = startTime; return this; }
        public ActivityResponseBuilder endTime(String endTime) { this.endTime = endTime; return this; }
        public ActivityResponseBuilder notes(String notes) { this.notes = notes; return this; }
        public ActivityResponseBuilder reminder(Boolean reminder) { this.reminder = reminder; return this; }
        public ActivityResponseBuilder sortOrder(Integer sortOrder) { this.sortOrder = sortOrder; return this; }

        public ActivityResponse build() {
            ActivityResponse ar = new ActivityResponse();
            ar.setId(id);
            ar.setTitle(title);
            ar.setType(type);
            ar.setPlace(place);
            ar.setStartTime(startTime);
            ar.setEndTime(endTime);
            ar.setNotes(notes);
            ar.setReminder(reminder);
            ar.setSortOrder(sortOrder);
            return ar;
        }
    }

    public static ActivityResponse from(Activity activity) {
        if (activity == null) return null;
        return ActivityResponse.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .type(activity.getType())
                .place(activity.getPlace())
                .startTime(activity.getStartTime())
                .endTime(activity.getEndTime())
                .notes(activity.getNotes())
                .reminder(activity.getReminder())
                .sortOrder(activity.getSortOrder())
                .build();
    }
}