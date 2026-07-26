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

    public static TripResponse from(Trip trip) {
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