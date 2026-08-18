package com.tripnest.service;

import com.tripnest.dto.ActivityDTO;
import com.tripnest.dto.ItineraryDTO;
import com.tripnest.entity.Activity;
import com.tripnest.entity.Itinerary;
import com.tripnest.entity.Trip;
import com.tripnest.entity.User;
import com.tripnest.exception.ForbiddenException;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.repository.ActivityRepository;
import com.tripnest.repository.ItineraryRepository;
import com.tripnest.repository.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final TripRepository tripRepository;
    private final ActivityRepository activityRepository;
    private final TripService tripService;

    public ItineraryService(ItineraryRepository itineraryRepository,
                            TripRepository tripRepository,
                            ActivityRepository activityRepository,
                            TripService tripService) {
        this.itineraryRepository = itineraryRepository;
        this.tripRepository = tripRepository;
        this.activityRepository = activityRepository;
        this.tripService = tripService;
    }

    @Transactional(readOnly = true)
    public List<ItineraryDTO> getItinerariesByTrip(Long tripId, User user) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        if (!tripService.isUserAuthorizedForTrip(trip, user)) {
            throw new ForbiddenException("Not authorized to view this trip's itinerary");
        }

        return itineraryRepository.findByTripOrderByDayNumberAsc(trip).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ItineraryDTO addItineraryDay(Long tripId, ItineraryDTO dto, User user) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        if (!tripService.isUserAuthorizedForTrip(trip, user)) {
            throw new ForbiddenException("Not authorized to modify this trip's itinerary");
        }

        List<Itinerary> existingDays = itineraryRepository.findByTripOrderByDayNumberAsc(trip);
        int nextDayNumber = existingDays.size() + 1;

        Itinerary itinerary = new Itinerary(
                trip,
                dto.getDayNumber() != null ? dto.getDayNumber() : nextDayNumber,
                dto.getDate() != null ? dto.getDate() : trip.getStartDate().plusDays(nextDayNumber - 1),
                dto.getTitle() != null ? dto.getTitle() : "Day " + nextDayNumber,
                dto.getNotes()
        );

        return mapToDTO(itineraryRepository.save(itinerary));
    }

    @Transactional
    public ItineraryDTO updateItineraryDay(Long id, ItineraryDTO dto, User user) {
        Itinerary itinerary = itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary", "id", id));

        if (!tripService.isUserAuthorizedForTrip(itinerary.getTrip(), user)) {
            throw new ForbiddenException("Not authorized to modify this itinerary day");
        }

        if (dto.getTitle() != null) itinerary.setTitle(dto.getTitle());
        if (dto.getNotes() != null) itinerary.setNotes(dto.getNotes());
        if (dto.getDate() != null) itinerary.setDate(dto.getDate());

        return mapToDTO(itineraryRepository.save(itinerary));
    }

    @Transactional
    public void deleteItineraryDay(Long id, User user) {
        Itinerary itinerary = itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary", "id", id));

        if (!tripService.isGroupAdmin(itinerary.getTrip(), user)) {
            throw new ForbiddenException("Only group admins can delete itinerary days");
        }

        itineraryRepository.delete(itinerary);
    }

    public ItineraryDTO mapToDTO(Itinerary it) {
        ItineraryDTO dto = new ItineraryDTO();
        dto.setId(it.getId());
        dto.setTripId(it.getTrip().getId());
        dto.setDayNumber(it.getDayNumber());
        dto.setDate(it.getDate());
        dto.setTitle(it.getTitle());
        dto.setNotes(it.getNotes());

        List<Activity> activities = activityRepository.findByItineraryOrderBySequenceOrderAscStartTimeAsc(it);
        dto.setActivities(activities.stream().map(this::mapActivityToDTO).collect(Collectors.toList()));
        return dto;
    }

    public ActivityDTO mapActivityToDTO(Activity a) {
        ActivityDTO dto = new ActivityDTO();
        dto.setId(a.getId());
        dto.setItineraryId(a.getItinerary().getId());
        dto.setTitle(a.getTitle());
        dto.setActivityType(a.getActivityType());
        dto.setStartTime(a.getStartTime());
        dto.setEndTime(a.getEndTime());
        dto.setDurationMinutes(a.getDurationMinutes());
        dto.setLocationName(a.getLocationName());
        dto.setAddress(a.getAddress());
        dto.setLatitude(a.getLatitude());
        dto.setLongitude(a.getLongitude());
        dto.setEstimatedCost(a.getEstimatedCost());
        dto.setActualCost(a.getActualCost());
        dto.setNotes(a.getNotes());
        dto.setSequenceOrder(a.getSequenceOrder());
        dto.setReminderSet(a.isReminderSet());
        return dto;
    }
}
