package com.travelplanner.controller;

import com.travelplanner.entity.Itinerary;
import com.travelplanner.entity.Activity;
import com.travelplanner.entity.Destination;
import com.travelplanner.repository.ItineraryRepository;
import com.travelplanner.repository.ActivityRepository;
import com.travelplanner.repository.DestinationRepository;
import com.travelplanner.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class ActivityController {

    @Autowired
    private ItineraryRepository itineraryRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private DestinationRepository destinationRepository;

    @GetMapping("/api/itineraries/{itineraryId}/activities")
    public ResponseEntity<List<Activity>> getActivities(@PathVariable Long itineraryId) {
        List<Activity> activities = activityRepository.findByItineraryId(itineraryId);
        return ResponseEntity.ok(activities);
    }

    @PostMapping("/api/itineraries/{itineraryId}/activities")
    public ResponseEntity<?> addActivity(@PathVariable Long itineraryId, @RequestBody Activity activityRequest) {
        Itinerary itinerary = itineraryRepository.findById(itineraryId).orElse(null);
        if (itinerary == null) {
            return ResponseEntity.notFound().build();
        }
        Activity activity = new Activity();
        activity.setItinerary(itinerary);
        activity.setTitle(activityRequest.getTitle());
        activity.setDescription(activityRequest.getDescription());
        activity.setStartTime(activityRequest.getStartTime());
        activity.setEndTime(activityRequest.getEndTime());
        activity.setCost(activityRequest.getCost());
        
        if (activityRequest.getDestination() != null && activityRequest.getDestination().getId() != null) {
            Destination destination = destinationRepository.findById(activityRequest.getDestination().getId()).orElse(null);
            activity.setDestination(destination);
        }
        
        Activity savedActivity = activityRepository.save(activity);
        return ResponseEntity.ok(savedActivity);
    }

    @PutMapping("/api/activities/{id}")
    public ResponseEntity<?> updateActivity(@PathVariable Long id, @RequestBody Activity activityRequest) {
        Activity activity = activityRepository.findById(id).orElse(null);
        if (activity == null) {
            return ResponseEntity.notFound().build();
        }
        activity.setTitle(activityRequest.getTitle());
        activity.setDescription(activityRequest.getDescription());
        activity.setStartTime(activityRequest.getStartTime());
        activity.setEndTime(activityRequest.getEndTime());
        activity.setCost(activityRequest.getCost());
        
        if (activityRequest.getDestination() != null && activityRequest.getDestination().getId() != null) {
            Destination destination = destinationRepository.findById(activityRequest.getDestination().getId()).orElse(null);
            activity.setDestination(destination);
        } else {
            activity.setDestination(null);
        }
        
        Activity updatedActivity = activityRepository.save(activity);
        return ResponseEntity.ok(updatedActivity);
    }

    @DeleteMapping("/api/activities/{id}")
    public ResponseEntity<?> deleteActivity(@PathVariable Long id) {
        Activity activity = activityRepository.findById(id).orElse(null);
        if (activity == null) {
            return ResponseEntity.notFound().build();
        }
        activityRepository.delete(activity);
        return ResponseEntity.ok(new MessageResponse("Activity deleted successfully!"));
    }
}
