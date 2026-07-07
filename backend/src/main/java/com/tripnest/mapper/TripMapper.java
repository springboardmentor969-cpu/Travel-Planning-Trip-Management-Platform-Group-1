package com.tripnest.mapper;

import com.tripnest.dto.TripDto;
import com.tripnest.entity.Trip;

public final class TripMapper {
    private TripMapper() {
    }

    public static TripDto toDto(Trip trip) {
        return new TripDto(
                trip.getId(),
                trip.getTitle(),
                trip.getDestination(),
                trip.getStartDate(),
                trip.getEndDate(),
                trip.getBudget(),
                trip.getStatus(),
                trip.getUser().getId(),
                trip.getUser().getName()
        );
    }

    public static void updateEntity(Trip trip, TripDto dto) {
        trip.setTitle(dto.title());
        trip.setDestination(dto.destination());
        trip.setStartDate(dto.startDate());
        trip.setEndDate(dto.endDate());
        trip.setBudget(dto.budget());
        trip.setStatus(dto.status());
    }
}
