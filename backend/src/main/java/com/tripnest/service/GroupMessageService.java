package com.tripnest.service;

import com.tripnest.dto.GroupMessageDTO;
import com.tripnest.entity.GroupMessage;
import com.tripnest.entity.Trip;
import com.tripnest.entity.User;
import com.tripnest.exception.ForbiddenException;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.repository.GroupMessageRepository;
import com.tripnest.repository.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupMessageService {

    private final GroupMessageRepository groupMessageRepository;
    private final TripRepository tripRepository;
    private final TripService tripService;

    public GroupMessageService(GroupMessageRepository groupMessageRepository,
                               TripRepository tripRepository,
                               TripService tripService) {
        this.groupMessageRepository = groupMessageRepository;
        this.tripRepository = tripRepository;
        this.tripService = tripService;
    }

    @Transactional
    public GroupMessageDTO postMessage(Long tripId, String text, User user) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        if (!tripService.isUserAuthorizedForTrip(trip, user)) {
            throw new ForbiddenException("Not authorized to post messages in this trip discussion");
        }

        GroupMessage msg = new GroupMessage(trip, user, text.trim());
        GroupMessage saved = groupMessageRepository.save(msg);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<GroupMessageDTO> getMessages(Long tripId, User user) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        if (!tripService.isUserAuthorizedForTrip(trip, user)) {
            throw new ForbiddenException("Not authorized to read messages in this trip discussion");
        }

        return groupMessageRepository.findByTripOrderBySentAtAsc(trip).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public GroupMessageDTO mapToDTO(GroupMessage m) {
        GroupMessageDTO dto = new GroupMessageDTO();
        dto.setId(m.getId());
        dto.setTripId(m.getTrip().getId());
        dto.setSenderId(m.getSender().getId());
        dto.setSenderName(m.getSender().getFullName());
        dto.setSenderAvatarUrl(m.getSender().getAvatarUrl());
        dto.setMessage(m.getMessage());
        dto.setSentAt(m.getSentAt());
        return dto;
    }
}
