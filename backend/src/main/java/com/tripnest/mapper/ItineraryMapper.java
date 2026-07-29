package com.tripnest.mapper;

import com.tripnest.dto.ItineraryDto;
import com.tripnest.entity.ActivityType; // ADD IMPORT
import com.tripnest.entity.Itinerary;
import com.tripnest.entity.Trip;

public final class ItineraryMapper {

    public static ItineraryDto toDto(Itinerary itinerary) {
        return new ItineraryDto(
                itinerary.getId(),
                itinerary.getDayNumber(),
                itinerary.getActivityType(), // ADD
                itinerary.getTitle(),
                itinerary.getDescription(),
                itinerary.getLocation(),     // ADD
                itinerary.getTime(),         // ADD
                itinerary.getTrip().getId()
        );
    }

    public static Itinerary toEntity(ItineraryDto dto, Trip trip) {
        Itinerary i = new Itinerary(); // No builder
        i.setId(dto.id());
        i.setDayNumber(dto.dayNumber());
        i.setActivityType(dto.activityType()); // ADD
        i.setTitle(dto.title());
        i.setDescription(dto.description());
        i.setLocation(dto.location());         // ADD
        i.setTime(dto.time());                 // ADD
        i.setTrip(trip);
        return i;
    }

    public static void updateEntity(Itinerary itinerary, ItineraryDto dto) {
        itinerary.setDayNumber(dto.dayNumber());
        itinerary.setActivityType(dto.activityType()); // ADD
        itinerary.setTitle(dto.title());
        itinerary.setDescription(dto.description());
        itinerary.setLocation(dto.location());         // ADD
        itinerary.setTime(dto.time());                 // ADD
    }
}