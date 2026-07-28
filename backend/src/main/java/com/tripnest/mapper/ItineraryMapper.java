package com.tripnest.mapper;

import com.tripnest.entity.ActivityType;
import com.tripnest.dto.ItineraryDto;
import com.tripnest.entity.Itinerary;
import java.time.LocalTime;

public final class ItineraryMapper {
    private ItineraryMapper() {
    }

    public static ItineraryDto toDto(Itinerary itinerary) {
        return new ItineraryDto(
                itinerary.getId(),
                itinerary.getDayNumber(),
                itinerary.getTitle(),
                itinerary.getDescription(),
                itinerary.getActivityType(),
                itinerary.getActivityTime(),
                itinerary.getTrip().getId()
        );
    }

    public static void updateEntity(Itinerary itinerary, ItineraryDto dto) {
        itinerary.setDayNumber(dto.dayNumber());
        itinerary.setTitle(dto.title());
        itinerary.setDescription(dto.description());
        itinerary.setActivityType(dto.activityType() == null ? ActivityType.SIGHTSEEING : dto.activityType());
        itinerary.setActivityTime(dto.activityTime() == null ? LocalTime.of(9, 0) : dto.activityTime());
    }
}
