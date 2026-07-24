package com.tripnest.service;

import com.tripnest.dto.*;
import com.tripnest.entity.Activity;
import com.tripnest.entity.ActivityType;
import com.tripnest.entity.Trip;
import com.tripnest.entity.User;
import com.tripnest.exception.ApiException;
import com.tripnest.repository.ActivityRepository;
import com.tripnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final TripService tripService;

    @Transactional
    public ActivityResponse addActivity(String userEmail, Long tripId, CreateActivityRequest request) {
        Trip trip = tripService.getTripVisibleToUser(userEmail, tripId);
        validateDayNumber(trip, request.getDayNumber());

        ActivityType type = parseType(request.getType());
        User creator = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        Activity activity = Activity.builder()
                .trip(trip)
                .dayNumber(request.getDayNumber())
                .time(request.getTime())
                .name(request.getName())
                .type(type)
                .location(request.getLocation())
                .notes(request.getNotes())
                .reminderMinutesBefore(request.getReminderMinutesBefore())
                .createdBy(creator)
                .build();

        activityRepository.save(activity);
        return toResponse(activity);
    }

    /** Full itinerary for a trip, grouped and ordered by day, then time. */
    public List<DayItinerary> getItinerary(String userEmail, Long tripId) {
        Trip trip = tripService.getTripVisibleToUser(userEmail, tripId);
        List<Activity> activities = activityRepository.findByTripOrderByDayNumberAscTimeAsc(trip);

        Map<Integer, List<ActivityResponse>> grouped = new TreeMap<>();
        for (Activity a : activities) {
            grouped.computeIfAbsent(a.getDayNumber(), k -> new java.util.ArrayList<>()).add(toResponse(a));
        }

        return grouped.entrySet().stream()
                .map(e -> DayItinerary.builder().dayNumber(e.getKey()).activities(e.getValue()).build())
                .toList();
    }

    public List<ActivityResponse> getDayActivities(String userEmail, Long tripId, Integer dayNumber) {
        Trip trip = tripService.getTripVisibleToUser(userEmail, tripId);
        return activityRepository.findByTripAndDayNumberOrderByTimeAsc(trip, dayNumber).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ActivityResponse updateActivity(String userEmail, Long tripId, Long activityId, UpdateActivityRequest request) {
        Trip trip = tripService.getTripVisibleToUser(userEmail, tripId);
        Activity activity = activityRepository.findByIdAndTrip(activityId, trip)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Activity not found on this trip"));

        if (request.getDayNumber() != null) {
            validateDayNumber(trip, request.getDayNumber());
            activity.setDayNumber(request.getDayNumber());
        }
        if (request.getTime() != null) activity.setTime(request.getTime());
        if (request.getName() != null) activity.setName(request.getName());
        if (request.getType() != null) activity.setType(parseType(request.getType()));
        if (request.getLocation() != null) activity.setLocation(request.getLocation());
        if (request.getNotes() != null) activity.setNotes(request.getNotes());
        if (request.getReminderMinutesBefore() != null) activity.setReminderMinutesBefore(request.getReminderMinutesBefore());

        activityRepository.save(activity);
        return toResponse(activity);
    }

    @Transactional
    public void deleteActivity(String userEmail, Long tripId, Long activityId) {
        Trip trip = tripService.getTripVisibleToUser(userEmail, tripId);
        Activity activity = activityRepository.findByIdAndTrip(activityId, trip)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Activity not found on this trip"));
        activityRepository.delete(activity);
    }

    // ---------- helpers ----------

    private ActivityType parseType(String type) {
        try {
            return ActivityType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Type must be one of: SIGHTSEEING, TRANSPORTATION, ACCOMMODATION, DINING, ADVENTURE, SHOPPING");
        }
    }

    /** If the trip has both dates set, keep day numbers within the trip's actual length. */
    private void validateDayNumber(Trip trip, Integer dayNumber) {
        if (trip.getStartDate() != null && trip.getEndDate() != null) {
            long tripLengthDays = ChronoUnit.DAYS.between(trip.getStartDate(), trip.getEndDate()) + 1;
            if (dayNumber > tripLengthDays) {
                throw new ApiException(HttpStatus.BAD_REQUEST,
                        "This trip only runs " + tripLengthDays + " day(s) - day " + dayNumber + " is out of range");
            }
        }
    }

    private ActivityResponse toResponse(Activity a) {
        return ActivityResponse.builder()
                .id(a.getId())
                .dayNumber(a.getDayNumber())
                .time(a.getTime())
                .name(a.getName())
                .type(a.getType().name())
                .location(a.getLocation())
                .notes(a.getNotes())
                .reminderMinutesBefore(a.getReminderMinutesBefore())
                .createdByName(a.getCreatedBy() == null ? null : a.getCreatedBy().getFullName())
                .build();
    }
}
