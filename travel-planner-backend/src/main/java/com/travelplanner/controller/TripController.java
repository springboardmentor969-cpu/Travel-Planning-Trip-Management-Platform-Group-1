package com.travelplanner.controller;

import com.travelplanner.entity.Trip;
import com.travelplanner.entity.User;
import com.travelplanner.entity.Itinerary;
import com.travelplanner.entity.Activity;
import com.travelplanner.entity.Notification;
import com.travelplanner.repository.TripRepository;
import com.travelplanner.repository.UserRepository;
import com.travelplanner.repository.ItineraryRepository;
import com.travelplanner.repository.ActivityRepository;
import com.travelplanner.repository.NotificationRepository;
import com.travelplanner.security.UserDetailsImpl;
import com.travelplanner.dto.MessageResponse;
import com.travelplanner.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/trips")
public class TripController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItineraryRepository itineraryRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Trip>> getMyTrips() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        List<Trip> trips = tripRepository.findByUserIdOrCollaboratorId(userDetails.getId());
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTripById(@PathVariable Long id) {
        Trip trip = tripRepository.findById(id).orElse(null);
        if (trip == null) {
            return ResponseEntity.notFound().build();
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        boolean isOwner = trip.getUser().getId().equals(userDetails.getId());
        boolean isCollaborator = trip.getCollaborators().stream().anyMatch(c -> c.getId().equals(userDetails.getId()));
        if (!isOwner && !isCollaborator) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: Unauthorized access to this trip."));
        }
        return ResponseEntity.ok(trip);
    }

    @PostMapping
    public ResponseEntity<?> createTrip(@RequestBody Trip tripRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Current user not found in database."));
        }
        Trip trip = new Trip();
        trip.setTitle(tripRequest.getTitle());
        trip.setDescription(tripRequest.getDescription());
        trip.setStartDate(tripRequest.getStartDate());
        trip.setEndDate(tripRequest.getEndDate());
        trip.setUser(user);
        Trip savedTrip = tripRepository.save(trip);
        return ResponseEntity.ok(savedTrip);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrip(@PathVariable Long id, @RequestBody Trip tripRequest) {
        Trip trip = tripRepository.findById(id).orElse(null);
        if (trip == null) {
            return ResponseEntity.notFound().build();
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        boolean isOwner = trip.getUser().getId().equals(userDetails.getId());
        boolean isCollaborator = trip.getCollaborators().stream().anyMatch(c -> c.getId().equals(userDetails.getId()));
        if (!isOwner && !isCollaborator) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: Unauthorized access to this trip."));
        }
        trip.setTitle(tripRequest.getTitle());
        trip.setDescription(tripRequest.getDescription());
        trip.setStartDate(tripRequest.getStartDate());
        trip.setEndDate(tripRequest.getEndDate());
        Trip updatedTrip = tripRepository.save(trip);
        return ResponseEntity.ok(updatedTrip);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id) {
        Trip trip = tripRepository.findById(id).orElse(null);
        if (trip == null) {
            return ResponseEntity.notFound().build();
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        if (!trip.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: Only the owner can delete this trip."));
        }
        // Cascade delete child itineraries and activities
        List<Itinerary> itineraries = itineraryRepository.findByTripId(id);
        for (Itinerary itinerary : itineraries) {
            List<Activity> activities = activityRepository.findByItineraryId(itinerary.getId());
            activityRepository.deleteAll(activities);
            itineraryRepository.delete(itinerary);
        }
        tripRepository.delete(trip);
        return ResponseEntity.ok(new MessageResponse("Trip deleted successfully!"));
    }

    // --- Collaboration Endpoints ---

    @GetMapping("/{id}/collaborators")
    public ResponseEntity<?> getCollaborators(@PathVariable Long id) {
        Trip trip = tripRepository.findById(id).orElse(null);
        if (trip == null) {
            return ResponseEntity.notFound().build();
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        boolean isOwner = trip.getUser().getId().equals(userDetails.getId());
        boolean isCollaborator = trip.getCollaborators().stream().anyMatch(c -> c.getId().equals(userDetails.getId()));
        if (!isOwner && !isCollaborator) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: Unauthorized access."));
        }
        return ResponseEntity.ok(trip.getCollaborators());
    }

    @PostMapping("/{id}/collaborators")
    public ResponseEntity<?> addCollaborator(@PathVariable Long id, @RequestParam String username) {
        Trip trip = tripRepository.findById(id).orElse(null);
        if (trip == null) {
            return ResponseEntity.notFound().build();
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        if (!trip.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: Only the owner can add co-planners."));
        }
        User collaborator = userRepository.findByUsername(username).orElse(null);
        if (collaborator == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User '" + username + "' not found."));
        }
        if (collaborator.getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: You are already the owner of this trip."));
        }
        trip.getCollaborators().add(collaborator);
        tripRepository.save(trip);

        try {
            emailService.sendCollaborationInvite(collaborator.getEmail(), collaborator.getFirstName(), userDetails.getUsername(), trip.getTitle());
        } catch (Exception e) {
            System.out.println("Email dispatch failed: " + e.getMessage());
        }

        // Log DB notification & push real-time SSE alert
        try {
            Notification notification = new Notification();
            notification.setUser(collaborator);
            notification.setMessage("You have been added as a co-planner to trip: \"" + trip.getTitle() + "\" by " + userDetails.getUsername());
            notification.setIsRead(false);
            notificationRepository.save(notification);
            NotificationController.pushAlert(collaborator.getId(), notification.getMessage());
        } catch (Exception e) {
            System.out.println("Real-time notification push failed: " + e.getMessage());
        }

        return ResponseEntity.ok(new MessageResponse("Co-planner '" + username + "' added successfully!"));
    }

    @DeleteMapping("/{id}/collaborators/{userId}")
    public ResponseEntity<?> removeCollaborator(@PathVariable Long id, @PathVariable Long userId) {
        Trip trip = tripRepository.findById(id).orElse(null);
        if (trip == null) {
            return ResponseEntity.notFound().build();
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        if (!trip.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: Only the owner can remove co-planners."));
        }
        boolean removed = trip.getCollaborators().removeIf(c -> c.getId().equals(userId));
        if (!removed) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User is not a co-planner on this trip."));
        }
        tripRepository.save(trip);
        return ResponseEntity.ok(new MessageResponse("Co-planner removed successfully."));
    }
}
