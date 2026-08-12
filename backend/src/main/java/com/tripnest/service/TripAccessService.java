package com.tripnest.service;

import com.tripnest.entity.Trip;
import com.tripnest.entity.User;
import com.tripnest.exception.ApiException;
import com.tripnest.repository.TripMemberRepository;
import com.tripnest.repository.TripRepository;
import com.tripnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TripAccessService {

    private final TripRepository tripRepository;
    private final TripMemberRepository memberRepository;
    private final UserRepository userRepository;

    public Trip findAccessibleTrip(Long userId, Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> ApiException.notFound("Trip not found."));

        if (trip.getOwner().getId().equals(userId)) {
            return trip;
        }

        if (memberRepository.existsByTripIdAndUserIdAndStatus(tripId, userId, "ACCEPTED")) {
            return trip;
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user != null && memberRepository.existsByTripIdAndEmailIgnoreCaseAndStatus(tripId, user.getEmail(), "ACCEPTED")) {
            return trip;
        }

        throw ApiException.notFound("Trip not found.");
    }

    public Trip findOwnedTrip(Long userId, Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> ApiException.notFound("Trip not found."));

        if (!trip.getOwner().getId().equals(userId)) {
            throw ApiException.notFound("Trip not found.");
        }

        return trip;
    }
}
