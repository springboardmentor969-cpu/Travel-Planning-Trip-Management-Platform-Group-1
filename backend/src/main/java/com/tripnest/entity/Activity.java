package com.tripnest.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityType type;

    private String place;

    private String startTime;

    private String endTime;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Builder.Default
    private Boolean reminder = false;

    @Builder.Default
    private Integer sortOrder = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "day_id", nullable = false)
    @JsonIgnore
    private ItineraryDay day;

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

    public ItineraryDay getDay() { return day; }
    public void setDay(ItineraryDay day) { this.day = day; }

    public static ActivityBuilder builder() {
        return new ActivityBuilder();
    }

    public static class ActivityBuilder {
        private Long id;
        private String title;
        private ActivityType type;
        private String place;
        private String startTime;
        private String endTime;
        private String notes;
        private Boolean reminder = false;
        private Integer sortOrder = 0;
        private ItineraryDay day;

        public ActivityBuilder id(Long id) { this.id = id; return this; }
        public ActivityBuilder title(String title) { this.title = title; return this; }
        public ActivityBuilder type(ActivityType type) { this.type = type; return this; }
        public ActivityBuilder place(String place) { this.place = place; return this; }
        public ActivityBuilder startTime(String startTime) { this.startTime = startTime; return this; }
        public ActivityBuilder endTime(String endTime) { this.endTime = endTime; return this; }
        public ActivityBuilder notes(String notes) { this.notes = notes; return this; }
        public ActivityBuilder reminder(Boolean reminder) { this.reminder = reminder; return this; }
        public ActivityBuilder sortOrder(Integer sortOrder) { this.sortOrder = sortOrder; return this; }
        public ActivityBuilder day(ItineraryDay day) { this.day = day; return this; }

        public Activity build() {
            Activity a = new Activity();
            a.setId(id);
            a.setTitle(title);
            a.setType(type);
            a.setPlace(place);
            a.setStartTime(startTime);
            a.setEndTime(endTime);
            a.setNotes(notes);
            a.setReminder(reminder);
            a.setSortOrder(sortOrder);
            a.setDay(day);
            return a;
        }
    }
}