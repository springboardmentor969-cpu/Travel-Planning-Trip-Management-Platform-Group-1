package com.tripnest.dto;

import com.tripnest.entity.Trip;
import com.tripnest.entity.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripResponse {

    private Long id;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double budget;
    private Integer travelerCount;
    private TripStatus status;
    private String coverImage;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }

    public Integer getTravelerCount() { return travelerCount; }
    public void setTravelerCount(Integer travelerCount) { this.travelerCount = travelerCount; }

    public TripStatus getStatus() { return status; }
    public void setStatus(TripStatus status) { this.status = status; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public static TripResponseBuilder builder() {
        return new TripResponseBuilder();
    }

    public static class TripResponseBuilder {
        private Long id;
        private String destination;
        private LocalDate startDate;
        private LocalDate endDate;
        private Double budget;
        private Integer travelerCount;
        private TripStatus status;
        private String coverImage;

        public TripResponseBuilder id(Long id) { this.id = id; return this; }
        public TripResponseBuilder destination(String destination) { this.destination = destination; return this; }
        public TripResponseBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public TripResponseBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public TripResponseBuilder budget(Double budget) { this.budget = budget; return this; }
        public TripResponseBuilder travelerCount(Integer travelerCount) { this.travelerCount = travelerCount; return this; }
        public TripResponseBuilder status(TripStatus status) { this.status = status; return this; }
        public TripResponseBuilder coverImage(String coverImage) { this.coverImage = coverImage; return this; }

        public TripResponse build() {
            TripResponse tr = new TripResponse();
            tr.setId(id);
            tr.setDestination(destination);
            tr.setStartDate(startDate);
            tr.setEndDate(endDate);
            tr.setBudget(budget);
            tr.setTravelerCount(travelerCount);
            tr.setStatus(status);
            tr.setCoverImage(coverImage);
            return tr;
        }
    }

    public static TripResponse from(Trip trip) {
        if (trip == null) return null;
        return TripResponse.builder()
                .id(trip.getId())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .budget(trip.getBudget())
                .travelerCount(trip.getTravelerCount())
                .status(trip.getStatus())
                .coverImage(trip.getCoverImage())
                .build();
    }
}