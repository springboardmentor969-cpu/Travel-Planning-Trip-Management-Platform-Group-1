package com.tripnest.service;

import com.tripnest.dto.TripRequest;
import com.tripnest.dto.TripResponse;
import com.tripnest.entity.Trip;
import com.tripnest.entity.TripStatus;
import com.tripnest.entity.User;
import com.tripnest.exception.ApiException;
import com.tripnest.repository.TripRepository;
import com.tripnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public List<TripResponse> getTrips(Long ownerId, TripStatus status, String search) {
        List<Trip> trips;

        if (status != null) {
            trips = tripRepository.findByOwnerIdAndStatusOrderByStartDateAsc(ownerId, status);
        } else if (search != null && !search.isBlank()) {
            trips = tripRepository.findByOwnerIdAndDestinationContainingIgnoreCaseOrderByStartDateAsc(
                    ownerId, search);
        } else {
            trips = tripRepository.findByOwnerIdOrderByStartDateAsc(ownerId);
        }

        return trips.stream().map(TripResponse::from).toList();
    }

    public TripResponse getTripById(Long ownerId, Long tripId) {
        Trip trip = findOwnedTrip(ownerId, tripId);
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

    private Trip findOwnedTrip(Long ownerId, Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> ApiException.notFound("Trip not found."));

        if (!trip.getOwner().getId().equals(ownerId)) {
            throw ApiException.notFound("Trip not found.");
        }

        return trip;
    }
}