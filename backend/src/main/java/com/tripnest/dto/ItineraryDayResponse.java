package com.tripnest.dto;

import com.tripnest.entity.ItineraryDay;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryDayResponse {

    private Long id;
    private Integer dayNumber;
    private LocalDate date;
    private List<ActivityResponse> activities;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getDayNumber() { return dayNumber; }
    public void setDayNumber(Integer dayNumber) { this.dayNumber = dayNumber; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public List<ActivityResponse> getActivities() { return activities; }
    public void setActivities(List<ActivityResponse> activities) { this.activities = activities; }

    public static ItineraryDayResponseBuilder builder() {
        return new ItineraryDayResponseBuilder();
    }

    public static class ItineraryDayResponseBuilder {
        private Long id;
        private Integer dayNumber;
        private LocalDate date;
        private List<ActivityResponse> activities;

        public ItineraryDayResponseBuilder id(Long id) { this.id = id; return this; }
        public ItineraryDayResponseBuilder dayNumber(Integer dayNumber) { this.dayNumber = dayNumber; return this; }
        public ItineraryDayResponseBuilder date(LocalDate date) { this.date = date; return this; }
        public ItineraryDayResponseBuilder activities(List<ActivityResponse> activities) { this.activities = activities; return this; }

        public ItineraryDayResponse build() {
            ItineraryDayResponse r = new ItineraryDayResponse();
            r.setId(id);
            r.setDayNumber(dayNumber);
            r.setDate(date);
            r.setActivities(activities);
            return r;
        }
    }

    public static ItineraryDayResponse from(ItineraryDay day) {
        if (day == null) return null;
        return ItineraryDayResponse.builder()
                .id(day.getId())
                .dayNumber(day.getDayNumber())
                .date(day.getDate())
                .activities(day.getActivities() != null ? day.getActivities().stream()
                        .map(ActivityResponse::from)
                        .toList() : null)
                .build();
    }
}