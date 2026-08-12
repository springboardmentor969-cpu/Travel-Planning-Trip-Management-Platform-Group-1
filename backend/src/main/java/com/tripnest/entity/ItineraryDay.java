package com.tripnest.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "itinerary_days")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer dayNumber;

    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    @JsonIgnore
    private Trip trip;

    @Builder.Default
    @OneToMany(mappedBy = "day", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<Activity> activities = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getDayNumber() { return dayNumber; }
    public void setDayNumber(Integer dayNumber) { this.dayNumber = dayNumber; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }

    public List<Activity> getActivities() { return activities; }
    public void setActivities(List<Activity> activities) { this.activities = activities; }

    public static ItineraryDayBuilder builder() {
        return new ItineraryDayBuilder();
    }

    public static class ItineraryDayBuilder {
        private Long id;
        private Integer dayNumber;
        private LocalDate date;
        private Trip trip;
        private List<Activity> activities = new ArrayList<>();

        public ItineraryDayBuilder id(Long id) { this.id = id; return this; }
        public ItineraryDayBuilder dayNumber(Integer dayNumber) { this.dayNumber = dayNumber; return this; }
        public ItineraryDayBuilder date(LocalDate date) { this.date = date; return this; }
        public ItineraryDayBuilder trip(Trip trip) { this.trip = trip; return this; }
        public ItineraryDayBuilder activities(List<Activity> activities) { this.activities = activities; return this; }

        public ItineraryDay build() {
            ItineraryDay id = new ItineraryDay();
            id.setId(this.id);
            id.setDayNumber(dayNumber);
            id.setDate(date);
            id.setTrip(trip);
            id.setActivities(activities);
            return id;
        }
    }
}