package com.tripnest.mapper;

import com.tripnest.dto.ItineraryDto;
import com.tripnest.entity.Itinerary;

public final class ItineraryMapper {
    private ItineraryMapper() {
    }

    public static ItineraryDto toDto(Itinerary itinerary) {
        return new ItineraryDto(
                itinerary.getId(),
                itinerary.getDayNumber(),
                itinerary.getTitle(),
                itinerary.getDescription(),
                itinerary.getTrip().getId()
        );
    }

    public static void updateEntity(Itinerary itinerary, ItineraryDto dto) {
        itinerary.setDayNumber(dto.dayNumber());
        itinerary.setTitle(dto.title());
        itinerary.setDescription(dto.description());
    }
}
