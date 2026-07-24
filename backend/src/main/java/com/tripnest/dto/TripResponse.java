package com.tripnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripResponse {

    private Long id;

    // Trip Details
    private String title;
    private String destination;

    private LocalDate startDate;
    private LocalDate endDate;

    // Number of Travellers
    private Integer travelers;

    // Traveller Names
    private List<String> travellerNames;

    // Budget
    private Double budget;

    // Status
    private String status;

    // Description
    private String description;

    // Favourite
    private Boolean favourite;

    // Owner Information
    private UserSummary owner;

    // Collaborators
    private List<UserSummary> collaborators;

    // Dates
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}