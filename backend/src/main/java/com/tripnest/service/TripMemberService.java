package com.tripnest.service;

import com.tripnest.dto.AddTripMemberRequest;
import com.tripnest.dto.TripMemberDto;
import com.tripnest.dto.UpdateTripMemberRequest;
import com.tripnest.entity.Trip;
import com.tripnest.entity.TripMember;
import com.tripnest.entity.TripMemberRole;
import com.tripnest.entity.User;
import com.tripnest.exception.DuplicateResourceException;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.repository.TripMemberRepository;
import com.tripnest.repository.TripRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TripMemberService {
    private final TripRepository tripRepository;
    private final TripMemberRepository memberRepository;
    private final UserService userService;

    public TripMemberService(TripRepository tripRepository, TripMemberRepository memberRepository, UserService userService) {
        this.tripRepository = tripRepository;
        this.memberRepository = memberRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<TripMemberDto> list(Long tripId) {
        Trip trip = requireReadable(tripId);
        List<TripMemberDto> members = new ArrayList<>();
        members.add(TripMemberDto.owner(trip.getUser().getId(), trip.getUser().getName(), trip.getUser().getEmail()));
        memberRepository.findByTripIdOrderByAddedAtAsc(tripId).forEach(member -> members.add(toDto(member)));
        return members;
    }

    public TripMemberDto add(Long tripId, AddTripMemberRequest request) {
        Trip trip = requireOwner(tripId);
        User user = userService.findEntityByEmail(request.email());
        if (trip.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("The trip owner is already a member");
        }
        if (memberRepository.existsByTripIdAndUserId(tripId, user.getId())) {
            throw new DuplicateResourceException("This user is already a trip member");
        }
        TripMember member = new TripMember();
        member.setTrip(trip);
        member.setUser(user);
        member.setRole(request.role() == null ? TripMemberRole.EDITOR : request.role());
        return toDto(memberRepository.save(member));
    }

    public TripMemberDto update(Long tripId, Long userId, UpdateTripMemberRequest request) {
        requireOwner(tripId);
        TripMember member = findMember(tripId, userId);
        member.setRole(request.role());
        return toDto(memberRepository.save(member));
    }

    public void remove(Long tripId, Long userId) {
        requireOwner(tripId);
        memberRepository.delete(findMember(tripId, userId));
    }

    private Trip requireOwner(Long tripId) {
        Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));
        if (!trip.getUser().getId().equals(userService.getCurrentUser().getId())) {
            throw new ResourceNotFoundException("Trip not found with id " + tripId);
        }
        return trip;
    }

    private Trip requireReadable(Long tripId) {
        Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));
        Long currentUserId = userService.getCurrentUser().getId();
        if (trip.getUser().getId().equals(currentUserId) || memberRepository.existsByTripIdAndUserId(tripId, currentUserId)) return trip;
        throw new ResourceNotFoundException("Trip not found with id " + tripId);
    }

    private TripMember findMember(Long tripId, Long userId) {
        return memberRepository.findByTripIdAndUserId(tripId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip member not found"));
    }

    private TripMemberDto toDto(TripMember member) {
        return new TripMemberDto(member.getUser().getId(), member.getUser().getName(), member.getUser().getEmail(), member.getRole().name(), member.getAddedAt());
    }
}
