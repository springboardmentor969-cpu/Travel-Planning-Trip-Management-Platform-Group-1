package com.tripnest.dto;

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
public class UpdateTripRequest {

    // Trip Title
    private String title;

    // Destination
    private String destination;

    // Travel Dates
    private LocalDate startDate;

    private LocalDate endDate;

    // Number of Travellers
    private Integer travelers;

    // Budget
    private Double budget;

    // Status
    private String status;

    // Description
    private String description;

    // Traveller Names
    private List<String> travellerNames;

    // Favourite
    private Boolean favourite;
}