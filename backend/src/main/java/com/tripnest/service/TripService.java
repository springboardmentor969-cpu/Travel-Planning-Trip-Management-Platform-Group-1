package com.tripnest.service;
import java.util.ArrayList;
import com.tripnest.dto.*;
import com.tripnest.entity.Trip;
import com.tripnest.entity.TripStatus;
import com.tripnest.entity.User;
import com.tripnest.exception.ApiException;
import com.tripnest.repository.TripRepository;
import com.tripnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

   @Transactional
public TripResponse createTrip(String ownerEmail, CreateTripRequest request) {

    User owner = getUserOrThrow(ownerEmail);

    if (request.getStartDate() != null &&
        request.getEndDate() != null &&
        request.getEndDate().isBefore(request.getStartDate())) {

        throw new ApiException(
                HttpStatus.BAD_REQUEST,
                "End date cannot be before start date");
    }

    Trip trip = Trip.builder()

            .title(request.getTitle())
            .destination(request.getDestination())

            .startDate(request.getStartDate())
            .endDate(request.getEndDate())

            .travelers(
                    request.getTravelers() == null
                            ? 1
                            : request.getTravelers()
            )

            .budget(
                    request.getBudget() == null
                            ? 0.0
                            : request.getBudget()
            )

            // NEW
            .description(request.getDescription())

            // NEW
            .travellerNames(
                    request.getTravellerNames() == null
                            ? new ArrayList<>()
                            : request.getTravellerNames()
            )

            // NEW
            .favourite(
                    request.getFavourite() == null
                            ? false
                            : request.getFavourite()
            )

            .status(TripStatus.PLANNING)

            .owner(owner)

            .build();

    tripRepository.save(trip);

    return toResponse(trip);
}

    public List<TripResponse> getMyTrips(String userEmail) {
        User user = getUserOrThrow(userEmail);
        return tripRepository.findAllVisibleToUser(user).stream()
                .map(this::toResponse)
                .toList();
    }

    public TripResponse getTripById(String userEmail, Long tripId) {
        Trip trip = getTripVisibleToUser(userEmail, tripId);
        return toResponse(trip);
    }

   @Transactional
public TripResponse updateTrip(String userEmail, Long tripId, UpdateTripRequest request) {

    Trip trip = getOwnedTrip(userEmail, tripId);

    if (request.getTitle() != null)
        trip.setTitle(request.getTitle());

    if (request.getDestination() != null)
        trip.setDestination(request.getDestination());

    if (request.getStartDate() != null)
        trip.setStartDate(request.getStartDate());

    if (request.getEndDate() != null)
        trip.setEndDate(request.getEndDate());

    if (request.getTravelers() != null)
        trip.setTravelers(request.getTravelers());

    if (request.getBudget() != null)
        trip.setBudget(request.getBudget());

    // NEW
    if (request.getDescription() != null)
        trip.setDescription(request.getDescription());

    // NEW
    if (request.getTravellerNames() != null)
        trip.setTravellerNames(request.getTravellerNames());

    // NEW
    if (request.getFavourite() != null)
        trip.setFavourite(request.getFavourite());

    if (request.getStatus() != null) {

        try {

            trip.setStatus(
                    TripStatus.valueOf(
                            request.getStatus().toUpperCase()
                    )
            );

        } catch (IllegalArgumentException ex) {

            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Status must be one of: PLANNING, CONFIRMED, ONGOING, COMPLETED, CANCELLED"
            );

        }

    }

    if (trip.getStartDate() != null &&
            trip.getEndDate() != null &&
            trip.getEndDate().isBefore(trip.getStartDate())) {

        throw new ApiException(
                HttpStatus.BAD_REQUEST,
                "End date cannot be before start date"
        );

    }

    trip.setUpdatedAt(LocalDateTime.now());

    tripRepository.save(trip);

    return toResponse(trip);

}

    @Transactional
    public void deleteTrip(String userEmail, Long tripId) {
        Trip trip = getOwnedTrip(userEmail, tripId);
        tripRepository.delete(trip);
    }

    @Transactional
    public TripResponse shareTrip(String userEmail, Long tripId, ShareTripRequest request) {
        Trip trip = getOwnedTrip(userEmail, tripId);

        User collaborator = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "No TripNest user with that email"));

        if (collaborator.getEmail().equalsIgnoreCase(trip.getOwner().getEmail())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You already own this trip");
        }
        if (trip.getCollaborators().stream().anyMatch(c -> c.getEmail().equalsIgnoreCase(collaborator.getEmail()))) {
            throw new ApiException(HttpStatus.CONFLICT, "This person is already on the trip");
        }

        trip.getCollaborators().add(collaborator);
        tripRepository.save(trip);
        return toResponse(trip);
    }

    @Transactional
    public TripResponse removeCollaborator(String userEmail, Long tripId, Long collaboratorUserId) {
        Trip trip = getOwnedTrip(userEmail, tripId);
        trip.getCollaborators().removeIf(c -> c.getId().equals(collaboratorUserId));
        tripRepository.save(trip);
        return toResponse(trip);
    }

    // ---------- helpers (also used by ItineraryService and BudgetService) ----------

    private User getUserOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    /** Trip must exist and the requester must be the owner (for edit/delete/share actions on the trip itself). */
    private Trip getOwnedTrip(String userEmail, Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Trip not found"));

        if (!trip.getOwner().getEmail().equalsIgnoreCase(userEmail)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the trip owner can do that");
        }
        return trip;
    }

    /**
     * Trip must exist and the requester must be the owner OR a collaborator.
     * Public so other modules (itinerary, budget, group) can reuse the same access rule
     * for anything that's meant to be collaborative rather than owner-only.
     */
    public Trip getTripVisibleToUser(String userEmail, Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Trip not found"));

        boolean isOwner = trip.getOwner().getEmail().equalsIgnoreCase(userEmail);
        boolean isCollaborator = trip.getCollaborators().stream()
                .anyMatch(c -> c.getEmail().equalsIgnoreCase(userEmail));

        if (!isOwner && !isCollaborator) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You don't have access to this trip");
        }
        return trip;
    }

   private TripResponse toResponse(Trip trip) {

    return TripResponse.builder()

            .id(trip.getId())

            .title(trip.getTitle())

            .destination(trip.getDestination())

            .startDate(trip.getStartDate())

            .endDate(trip.getEndDate())

            .travelers(trip.getTravelers())

            // NEW
            .travellerNames(trip.getTravellerNames())

            .budget(trip.getBudget())

            .status(trip.getStatus().name())

            // NEW
            .description(trip.getDescription())

            // NEW
            .favourite(trip.getFavourite())

            .owner(toSummary(trip.getOwner()))

            .collaborators(
                    trip.getCollaborators()
                            .stream()
                            .map(this::toSummary)
                            .toList()
            )

            .createdAt(trip.getCreatedAt())

            .updatedAt(trip.getUpdatedAt())

            .build();

}
    private UserSummary toSummary(User user) {
        return UserSummary.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
