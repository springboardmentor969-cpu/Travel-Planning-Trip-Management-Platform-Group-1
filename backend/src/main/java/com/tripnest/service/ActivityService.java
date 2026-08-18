package com.tripnest.service;

import com.tripnest.dto.ActivityDTO;
import com.tripnest.entity.Activity;
import com.tripnest.entity.Itinerary;
import com.tripnest.entity.User;
import com.tripnest.exception.ForbiddenException;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.repository.ActivityRepository;
import com.tripnest.repository.ItineraryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final ItineraryRepository itineraryRepository;
    private final TripService tripService;
    private final ItineraryService itineraryService;

    public ActivityService(ActivityRepository activityRepository,
                           ItineraryRepository itineraryRepository,
                           TripService tripService,
                           ItineraryService itineraryService) {
        this.activityRepository = activityRepository;
        this.itineraryRepository = itineraryRepository;
        this.tripService = tripService;
        this.itineraryService = itineraryService;
    }

    @Transactional
    public ActivityDTO addActivity(Long itineraryId, ActivityDTO dto, User user) {
        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary", "id", itineraryId));

        if (!tripService.isUserAuthorizedForTrip(itinerary.getTrip(), user)) {
            throw new ForbiddenException("Not authorized to add activities to this trip");
        }

        Activity activity = new Activity();
        activity.setItinerary(itinerary);
        activity.setTitle(dto.getTitle().trim());
        activity.setActivityType(dto.getActivityType() != null ? dto.getActivityType() : Activity.ActivityType.SIGHTSEEING);
        activity.setStartTime(dto.getStartTime());
        activity.setEndTime(dto.getEndTime());
        activity.setDurationMinutes(dto.getDurationMinutes());
        activity.setLocationName(dto.getLocationName());
        activity.setAddress(dto.getAddress());
        activity.setLatitude(dto.getLatitude());
        activity.setLongitude(dto.getLongitude());
        activity.setEstimatedCost(dto.getEstimatedCost() != null ? dto.getEstimatedCost() : 0.0);
        activity.setActualCost(dto.getActualCost() != null ? dto.getActualCost() : 0.0);
        activity.setNotes(dto.getNotes());
        activity.setReminderSet(dto.isReminderSet());

        long count = activityRepository.countByItinerary(itinerary);
        activity.setSequenceOrder(dto.getSequenceOrder() != null ? dto.getSequenceOrder() : (int) count + 1);

        Activity saved = activityRepository.save(activity);
        return itineraryService.mapActivityToDTO(saved);
    }

    @Transactional
    public ActivityDTO updateActivity(Long id, ActivityDTO dto, User user) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", id));

        if (!tripService.isUserAuthorizedForTrip(activity.getItinerary().getTrip(), user)) {
            throw new ForbiddenException("Not authorized to update this activity");
        }

        activity.setTitle(dto.getTitle().trim());
        if (dto.getActivityType() != null) activity.setActivityType(dto.getActivityType());
        activity.setStartTime(dto.getStartTime());
        activity.setEndTime(dto.getEndTime());
        activity.setDurationMinutes(dto.getDurationMinutes());
        activity.setLocationName(dto.getLocationName());
        activity.setAddress(dto.getAddress());
        if (dto.getLatitude() != null) activity.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null) activity.setLongitude(dto.getLongitude());
        if (dto.getEstimatedCost() != null) activity.setEstimatedCost(dto.getEstimatedCost());
        if (dto.getActualCost() != null) activity.setActualCost(dto.getActualCost());
        activity.setNotes(dto.getNotes());
        activity.setReminderSet(dto.isReminderSet());
        if (dto.getSequenceOrder() != null) activity.setSequenceOrder(dto.getSequenceOrder());

        Activity saved = activityRepository.save(activity);
        return itineraryService.mapActivityToDTO(saved);
    }

    @Transactional
    public void deleteActivity(Long id, User user) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", id));

        if (!tripService.isUserAuthorizedForTrip(activity.getItinerary().getTrip(), user)) {
            throw new ForbiddenException("Not authorized to delete this activity");
        }

        activityRepository.delete(activity);
    }

    @Transactional
    public void reorderActivities(Long itineraryId, List<Long> activityIds, User user) {
        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary", "id", itineraryId));

        if (!tripService.isUserAuthorizedForTrip(itinerary.getTrip(), user)) {
            throw new ForbiddenException("Not authorized to reorder activities in this itinerary");
        }

        for (int i = 0; i < activityIds.size(); i++) {
            Long actId = activityIds.get(i);
            Activity activity = activityRepository.findById(actId).orElse(null);
            if (activity != null && activity.getItinerary().getId().equals(itineraryId)) {
                activity.setSequenceOrder(i + 1);
                activityRepository.save(activity);
            }
        }
    }
}
