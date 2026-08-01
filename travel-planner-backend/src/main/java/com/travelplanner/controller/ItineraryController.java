package com.travelplanner.controller;

import com.travelplanner.entity.Trip;
import com.travelplanner.entity.Itinerary;
import com.travelplanner.entity.Activity;
import com.travelplanner.repository.TripRepository;
import com.travelplanner.repository.ItineraryRepository;
import com.travelplanner.repository.ActivityRepository;
import com.travelplanner.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class ItineraryController {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private ItineraryRepository itineraryRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @GetMapping("/api/trips/{tripId}/itineraries")
    public ResponseEntity<List<Itinerary>> getItinerariesByTrip(@PathVariable Long tripId) {
        List<Itinerary> itineraries = itineraryRepository.findByTripId(tripId);
        return ResponseEntity.ok(itineraries);
    }

    @PostMapping("/api/trips/{tripId}/itineraries")
    public ResponseEntity<?> addItineraryDay(@PathVariable Long tripId, @RequestBody Itinerary itineraryRequest) {
        Trip trip = tripRepository.findById(tripId).orElse(null);
        if (trip == null) {
            return ResponseEntity.notFound().build();
        }
        Itinerary itinerary = new Itinerary();
        itinerary.setTrip(trip);
        itinerary.setDayNumber(itineraryRequest.getDayNumber());
        itinerary.setDate(itineraryRequest.getDate());
        itinerary.setTitle(itineraryRequest.getTitle());
        Itinerary savedItinerary = itineraryRepository.save(itinerary);
        return ResponseEntity.ok(savedItinerary);
    }

    @PutMapping("/api/itineraries/{id}")
    public ResponseEntity<?> updateItineraryDay(@PathVariable Long id, @RequestBody Itinerary itineraryRequest) {
        Itinerary itinerary = itineraryRepository.findById(id).orElse(null);
        if (itinerary == null) {
            return ResponseEntity.notFound().build();
        }
        itinerary.setTitle(itineraryRequest.getTitle());
        Itinerary updatedItinerary = itineraryRepository.save(itinerary);
        return ResponseEntity.ok(updatedItinerary);
    }

    @DeleteMapping("/api/itineraries/{id}")
    public ResponseEntity<?> deleteItineraryDay(@PathVariable Long id) {
        Itinerary itinerary = itineraryRepository.findById(id).orElse(null);
        if (itinerary == null) {
            return ResponseEntity.notFound().build();
        }
        // Delete child activities
        List<Activity> activities = activityRepository.findByItineraryId(id);
        activityRepository.deleteAll(activities);
        itineraryRepository.delete(itinerary);
        return ResponseEntity.ok(new MessageResponse("Itinerary day deleted successfully!"));
    }
}
