package com.tripnest.service;

import com.tripnest.dto.TripInvitationDto;
import com.tripnest.entity.InvitationStatus;
import com.tripnest.entity.Trip;
import com.tripnest.entity.TripInvitation;
import com.tripnest.entity.User;
import com.tripnest.exception.DuplicateResourceException;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.repository.TripInvitationRepository;
import com.tripnest.repository.TripRepository;
import com.tripnest.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TripInvitationService {
    private final TripRepository tripRepository;
    private final TripInvitationRepository tripInvitationRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public TripInvitationService(
            TripRepository tripRepository,
            TripInvitationRepository tripInvitationRepository,
            UserRepository userRepository,
            UserService userService
    ) {
        this.tripRepository = tripRepository;
        this.tripInvitationRepository = tripInvitationRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public TripInvitationDto invite(Long tripId, String email) {
        Trip trip = findOwnedTrip(tripId);
        String normalizedEmail = email.trim().toLowerCase();
        User owner = trip.getUser();
        if (owner.getEmail().equalsIgnoreCase(normalizedEmail)) {
            throw new DuplicateResourceException("Trip owner is already part of the trip");
        }
        boolean alreadyCollaborator = trip.getCollaborators().stream()
                .anyMatch(user -> user.getEmail().equalsIgnoreCase(normalizedEmail));
        if (alreadyCollaborator) {
            throw new DuplicateResourceException("User already has access to this trip");
        }
        if (tripInvitationRepository.existsByTripIdAndInviteeEmailAndStatus(tripId, normalizedEmail, InvitationStatus.PENDING)) {
            throw new DuplicateResourceException("An invite is already pending for this email");
        }

        TripInvitation invitation = new TripInvitation();
        invitation.setTrip(trip);
        invitation.setInvitedBy(owner);
        invitation.setInviteeEmail(normalizedEmail);
        invitation.setStatus(InvitationStatus.PENDING);
        invitation.setCreatedAt(LocalDateTime.now());
        return toDto(tripInvitationRepository.save(invitation));
    }

    @Transactional(readOnly = true)
    public List<TripInvitationDto> listForCurrentUser() {
        String email = userService.getCurrentUser().getEmail();
        return tripInvitationRepository.findByInviteeEmailAndStatusOrderByCreatedAtDesc(email, InvitationStatus.PENDING)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TripInvitationDto> listForTrip(Long tripId) {
        findOwnedTrip(tripId);
        return tripInvitationRepository.findByTripIdOrderByCreatedAtDesc(tripId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public TripInvitationDto accept(Long invitationId) {
        TripInvitation invitation = findPendingForCurrentUser(invitationId);
        Trip trip = invitation.getTrip();
        User currentUser = userService.getCurrentUser();
        boolean alreadyCollaborator = trip.getCollaborators().stream()
                .anyMatch(user -> user.getId().equals(currentUser.getId()));
        if (!alreadyCollaborator) {
            trip.getCollaborators().add(currentUser);
            tripRepository.save(trip);
        }
        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitation.setRespondedAt(LocalDateTime.now());
        return toDto(tripInvitationRepository.save(invitation));
    }

    public TripInvitationDto reject(Long invitationId) {
        TripInvitation invitation = findPendingForCurrentUser(invitationId);
        invitation.setStatus(InvitationStatus.REJECTED);
        invitation.setRespondedAt(LocalDateTime.now());
        return toDto(tripInvitationRepository.save(invitation));
    }

    public void removeCollaborator(Long tripId, Long collaboratorId) {
        Trip trip = findOwnedTrip(tripId);
        boolean removed = trip.getCollaborators().removeIf(user -> user.getId().equals(collaboratorId));
        if (!removed) {
            throw new ResourceNotFoundException("Collaborator not found for trip " + tripId);
        }
        tripRepository.save(trip);
    }

    private Trip findOwnedTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));
        if (!trip.getUser().getId().equals(userService.getCurrentUser().getId())) {
            throw new ResourceNotFoundException("Trip not found with id " + tripId);
        }
        return trip;
    }

    private TripInvitation findPendingForCurrentUser(Long invitationId) {
        TripInvitation invitation = tripInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with id " + invitationId));
        String currentEmail = userService.getCurrentUser().getEmail();
        if (!invitation.getInviteeEmail().equalsIgnoreCase(currentEmail)) {
            throw new ResourceNotFoundException("Invitation not found with id " + invitationId);
        }
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new DuplicateResourceException("Invitation has already been handled");
        }
        return invitation;
    }

    private TripInvitationDto toDto(TripInvitation invitation) {
        return new TripInvitationDto(
                invitation.getId(),
                invitation.getTrip().getId(),
                invitation.getTrip().getTitle(),
                invitation.getTrip().getDestination(),
                invitation.getInviteeEmail(),
                invitation.getInvitedBy().getName(),
                invitation.getInvitedBy().getEmail(),
                invitation.getStatus(),
                invitation.getCreatedAt(),
                invitation.getRespondedAt()
        );
    }
}