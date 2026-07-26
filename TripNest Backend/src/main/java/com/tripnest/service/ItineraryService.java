package com.tripnest.service;

import com.tripnest.dto.ActivityRequest;
import com.tripnest.dto.ActivityResponse;
import com.tripnest.dto.ItineraryDayRequest;
import com.tripnest.dto.ItineraryDayResponse;
import com.tripnest.dto.ReorderRequest;
import com.tripnest.entity.Activity;
import com.tripnest.entity.ItineraryDay;
import com.tripnest.entity.Trip;
import com.tripnest.exception.ApiException;
import com.tripnest.repository.ActivityRepository;
import com.tripnest.repository.ItineraryDayRepository;
import com.tripnest.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final ItineraryDayRepository dayRepository;
    private final ActivityRepository activityRepository;
    private final TripRepository tripRepository;

    public List<ItineraryDayResponse> getItinerary(Long ownerId, Long tripId) {
        findOwnedTrip(ownerId, tripId);
        return dayRepository.findByTripIdOrderByDayNumberAsc(tripId).stream()
                .map(ItineraryDayResponse::from)
                .toList();
    }

    @Transactional
    public ItineraryDayResponse addDay(Long ownerId, Long tripId, ItineraryDayRequest request) {
        Trip trip = findOwnedTrip(ownerId, tripId);

        ItineraryDay day = ItineraryDay.builder()
                .dayNumber(request.getDayNumber())
                .date(request.getDate())
                .trip(trip)
                .build();

        dayRepository.save(day);
        return ItineraryDayResponse.from(day);
    }

    @Transactional
    public void removeDay(Long ownerId, Long tripId, Long dayId) {
        findOwnedTrip(ownerId, tripId);
        ItineraryDay day = findDayInTrip(tripId, dayId);
        dayRepository.delete(day);
    }

    @Transactional
    public ActivityResponse addActivity(Long ownerId, Long tripId, Long dayId, ActivityRequest request) {
        findOwnedTrip(ownerId, tripId);
        ItineraryDay day = findDayInTrip(tripId, dayId);

        int nextSortOrder = (int) activityRepository.countByDayId(dayId);

        Activity activity = Activity.builder()
                .title(request.getTitle())
                .type(request.getType())
                .place(request.getPlace())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .notes(request.getNotes())
                .reminder(request.getReminder() != null ? request.getReminder() : false)
                .sortOrder(nextSortOrder)
                .day(day)
                .build();

        activityRepository.save(activity);
        return ActivityResponse.from(activity);
    }

    @Transactional
    public ActivityResponse updateActivity(Long ownerId, Long tripId, Long activityId, ActivityRequest request) {
        findOwnedTrip(ownerId, tripId);
        Activity activity = findActivityInTrip(tripId, activityId);

        activity.setTitle(request.getTitle());
        activity.setType(request.getType());
        activity.setPlace(request.getPlace());
        activity.setStartTime(request.getStartTime());
        activity.setEndTime(request.getEndTime());
        activity.setNotes(request.getNotes());
        if (request.getReminder() != null) {
            activity.setReminder(request.getReminder());
        }

        activityRepository.save(activity);
        return ActivityResponse.from(activity);
    }

    @Transactional
    public void deleteActivity(Long ownerId, Long tripId, Long activityId) {
        findOwnedTrip(ownerId, tripId);
        Activity activity = findActivityInTrip(tripId, activityId);
        activityRepository.delete(activity);
    }

    @Transactional
    public ActivityResponse reorderActivity(Long ownerId, Long tripId, Long activityId, ReorderRequest request) {
        findOwnedTrip(ownerId, tripId);
        Activity activity = findActivityInTrip(tripId, activityId);

        if (request.getTargetDayId() != null
                && !request.getTargetDayId().equals(activity.getDay().getId())) {
            ItineraryDay targetDay = findDayInTrip(tripId, request.getTargetDayId());
            activity.setDay(targetDay);
        }

        activity.setSortOrder(request.getSortOrder());
        activityRepository.save(activity);
        return ActivityResponse.from(activity);
    }

    private Trip findOwnedTrip(Long ownerId, Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> ApiException.notFound("Trip not found."));

        if (!trip.getOwner().getId().equals(ownerId)) {
            throw ApiException.notFound("Trip not found.");
        }

        return trip;
    }

    private ItineraryDay findDayInTrip(Long tripId, Long dayId) {
        ItineraryDay day = dayRepository.findById(dayId)
                .orElseThrow(() -> ApiException.notFound("Itinerary day not found."));

        if (!day.getTrip().getId().equals(tripId)) {
            throw ApiException.notFound("Itinerary day not found.");
        }

        return day;
    }

    private Activity findActivityInTrip(Long tripId, Long activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> ApiException.notFound("Activity not found."));

        if (!activity.getDay().getTrip().getId().equals(tripId)) {
            throw ApiException.notFound("Activity not found.");
        }

        return activity;
    }
}