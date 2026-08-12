package com.tripnest.service;

import com.tripnest.dto.ItineraryDayResponse;
import com.tripnest.dto.MessageResponse;
import com.tripnest.dto.TripRequest;
import com.tripnest.dto.TripResponse;
import com.tripnest.dto.TripTimelineResponse;
import com.tripnest.entity.Trip;
import com.tripnest.entity.TripStatus;
import com.tripnest.entity.User;
import com.tripnest.exception.ApiException;
import com.tripnest.entity.TripMember;
import com.tripnest.repository.TripMemberRepository;
import com.tripnest.repository.TripRepository;
import com.tripnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final TripMemberRepository memberRepository;
    private final ItineraryService itineraryService;
    private final TripAccessService tripAccessService;

    public List<TripResponse> getTrips(Long ownerId, TripStatus status, String search) {
        User user = userRepository.findById(ownerId).orElse(null);
        String userEmail = user != null && user.getEmail() != null ? user.getEmail() : "";

        // Map to deduplicate trips preserving order
        Map<Long, Trip> tripMap = new LinkedHashMap<>();

        // 1. Owned trips
        List<Trip> ownedTrips = tripRepository.findByOwnerIdOrderByStartDateAsc(ownerId);
        for (Trip t : ownedTrips) {
            tripMap.put(t.getId(), t);
        }

        // 2. Accepted member trips by user ID
        List<TripMember> memberByUser = memberRepository.findByUserIdAndStatus(ownerId, "ACCEPTED");
        for (TripMember tm : memberByUser) {
            if (tm.getTrip() != null) {
                tripMap.putIfAbsent(tm.getTrip().getId(), tm.getTrip());
            }
        }

        // 3. Accepted member trips by email (case-insensitive)
        if (!userEmail.isBlank()) {
            List<TripMember> memberByEmail = memberRepository.findByEmailIgnoreCaseAndStatus(userEmail, "ACCEPTED");
            for (TripMember tm : memberByEmail) {
                if (tm.getTrip() != null) {
                    tripMap.putIfAbsent(tm.getTrip().getId(), tm.getTrip());
                }
            }
        }

        List<Trip> trips = new ArrayList<>(tripMap.values());

        // Sort by start date
        trips.sort((t1, t2) -> {
            if (t1.getStartDate() == null) return 1;
            if (t2.getStartDate() == null) return -1;
            return t1.getStartDate().compareTo(t2.getStartDate());
        });

        if (status != null) {
            trips = trips.stream().filter(t -> t.getStatus() == status).toList();
        }
        if (search != null && !search.isBlank()) {
            String lowerSearch = search.toLowerCase();
            trips = trips.stream()
                    .filter(t -> t.getDestination() != null && t.getDestination().toLowerCase().contains(lowerSearch))
                    .toList();
        }

        return trips.stream().map(TripResponse::from).toList();
    }

    public TripResponse getTripById(Long userId, Long tripId) {
        Trip trip = tripAccessService.findAccessibleTrip(userId, tripId);
        return TripResponse.from(trip);
    }

    @Transactional
    public TripResponse createTrip(Long ownerId, TripRequest request) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> ApiException.notFound("User not found."));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw ApiException.badRequest("End date can't be before the start date.");
        }

        Trip trip = Trip.builder()
                .destination(request.getDestination())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .budget(request.getBudget())
                .travelerCount(request.getTravelerCount() != null ? request.getTravelerCount() : 1)
                .status(request.getStatus() != null ? request.getStatus() : TripStatus.PLANNING)
                .owner(owner)
                .build();

        tripRepository.save(trip);
        return TripResponse.from(trip);
    }

    @Transactional
    public TripResponse updateTrip(Long ownerId, Long tripId, TripRequest request) {
        Trip trip = findOwnedTrip(ownerId, tripId);

        trip.setDestination(request.getDestination());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setBudget(request.getBudget());
        if (request.getTravelerCount() != null) {
            trip.setTravelerCount(request.getTravelerCount());
        }
        if (request.getStatus() != null) {
            trip.setStatus(request.getStatus());
        }

        tripRepository.save(trip);
        return TripResponse.from(trip);
    }

    @Transactional
    public void deleteTrip(Long ownerId, Long tripId) {
        Trip trip = findOwnedTrip(ownerId, tripId);
        tripRepository.delete(trip);
    }

    public MessageResponse shareTrip(Long ownerId, Long tripId, String email) {
        Trip trip = findOwnedTrip(ownerId, tripId);
        return new MessageResponse("Trip to " + trip.getDestination() + " shared successfully with " + email);
    }

    public TripTimelineResponse getTripTimeline(Long ownerId, Long tripId) {
        Trip trip = findOwnedTrip(ownerId, tripId);
        List<ItineraryDayResponse> timelineDays = itineraryService.getItinerary(ownerId, tripId);

        return TripTimelineResponse.builder()
                .id(trip.getId())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .timeline(timelineDays)
                .build();
    }

    private Trip findOwnedTrip(Long ownerId, Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> ApiException.notFound("Trip not found."));

        if (!trip.getOwner().getId().equals(ownerId)) {
            throw ApiException.notFound("Trip not found.");
        }

        return trip;
    }
}