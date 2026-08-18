package com.tripnest.service;

import com.tripnest.dto.SettlementDTO;
import com.tripnest.dto.TripMemberDTO;
import com.tripnest.entity.Notification;
import com.tripnest.entity.Trip;
import com.tripnest.entity.TripMember;
import com.tripnest.entity.User;
import com.tripnest.exception.BadRequestException;
import com.tripnest.exception.ForbiddenException;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.repository.ExpenseRepository;
import com.tripnest.repository.TripMemberRepository;
import com.tripnest.repository.TripRepository;
import com.tripnest.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TripMemberService {

    private final TripMemberRepository tripMemberRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final TripService tripService;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public TripMemberService(TripMemberRepository tripMemberRepository,
                             TripRepository tripRepository,
                             UserRepository userRepository,
                             ExpenseRepository expenseRepository,
                             TripService tripService,
                             NotificationService notificationService,
                             EmailService emailService) {
        this.tripMemberRepository = tripMemberRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
        this.tripService = tripService;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    @Transactional
    public TripMemberDTO inviteMember(Long tripId, String email, TripMember.GroupRole role, User currentUser) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        if (!tripService.isGroupAdmin(trip, currentUser)) {
            throw new ForbiddenException("Only group admins can invite members to this trip");
        }

        User invitedUser = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("No registered user found with email: " + email));

        if (tripMemberRepository.existsByTripAndUser(trip, invitedUser)) {
            throw new BadRequestException("User is already a member or has a pending invitation for this trip");
        }

        TripMember member = new TripMember(
                trip,
                invitedUser,
                role != null ? role : TripMember.GroupRole.MEMBER,
                TripMember.InviteStatus.PENDING
        );
        TripMember saved = tripMemberRepository.save(member);

        // Send In-app notification
        notificationService.createNotification(
                invitedUser,
                "Trip Invitation: " + trip.getTitle(),
                currentUser.getFullName() + " invited you to join the trip \"" + trip.getTitle() + "\" to " + trip.getDestination(),
                Notification.NotificationType.GROUP_INVITE,
                "/trips/" + trip.getId()
        );

        // Send Email notification
        String inviteUrl = "http://localhost:5173/trips/" + trip.getId();
        emailService.sendTripInviteEmail(invitedUser.getEmail(), currentUser.getFullName(), trip.getTitle(), inviteUrl);

        return mapToDTO(saved);
    }

    @Transactional
    public TripMemberDTO respondToInvitation(Long tripId, TripMember.InviteStatus status, User currentUser) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        TripMember member = tripMemberRepository.findByTripAndUser(trip, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("No invitation found for this trip"));

        member.setInviteStatus(status);
        TripMember saved = tripMemberRepository.save(member);

        if (status == TripMember.InviteStatus.ACCEPTED) {
            notificationService.createNotification(
                    trip.getOwner(),
                    "Invitation Accepted",
                    currentUser.getFullName() + " accepted your invitation to join \"" + trip.getTitle() + "\"",
                    Notification.NotificationType.TRAVEL_UPDATE,
                    "/trips/" + trip.getId() + "/group"
            );
        }

        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<TripMemberDTO> getTripMembers(Long tripId, User currentUser) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        if (!tripService.isUserAuthorizedForTrip(trip, currentUser)) {
            throw new ForbiddenException("Not authorized to view members of this trip");
        }

        return tripMemberRepository.findByTrip(trip).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeMember(Long tripId, Long memberUserId, User currentUser) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        if (!tripService.isGroupAdmin(trip, currentUser) && !currentUser.getId().equals(memberUserId)) {
            throw new ForbiddenException("Not authorized to remove members from this trip");
        }

        if (trip.getOwner().getId().equals(memberUserId)) {
            throw new BadRequestException("Trip owner cannot be removed from the trip");
        }

        User targetUser = userRepository.findById(memberUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", memberUserId));

        tripMemberRepository.deleteByTripAndUser(trip, targetUser);
    }

    @Transactional(readOnly = true)
    public SettlementDTO calculateSettlements(Long tripId, User currentUser) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        if (!tripService.isUserAuthorizedForTrip(trip, currentUser)) {
            throw new ForbiddenException("Not authorized to view settlements for this trip");
        }

        List<TripMember> members = tripMemberRepository.findByTrip(trip).stream()
                .filter(m -> m.getInviteStatus() == TripMember.InviteStatus.ACCEPTED)
                .collect(Collectors.toList());

        Double totalExpenses = expenseRepository.sumAmountByTrip(trip);
        double total = totalExpenses != null ? totalExpenses : 0.0;
        int memberCount = Math.max(1, members.size());
        double equalShare = total / memberCount;

        Map<Long, Double> paidMap = new HashMap<>();
        for (TripMember m : members) {
            paidMap.put(m.getUser().getId(), 0.0);
        }

        List<Object[]> payerSums = expenseRepository.sumAmountByTripGroupByPaidBy(trip);
        for (Object[] row : payerSums) {
            if (row[0] != null) {
                Long uid = (Long) row[0];
                Double amount = (Double) row[2];
                paidMap.put(uid, amount);
            }
        }

        List<SettlementDTO.MemberSpending> memberBalances = new ArrayList<>();
        // Priority queues for debtors (owes) and creditors (owed)
        List<Map.Entry<String, Double>> debtors = new ArrayList<>();
        List<Map.Entry<String, Double>> creditors = new ArrayList<>();

        for (TripMember m : members) {
            Long uid = m.getUser().getId();
            double paid = paidMap.getOrDefault(uid, 0.0);
            double net = paid - equalShare;

            memberBalances.add(new SettlementDTO.MemberSpending(
                    uid,
                    m.getUser().getFullName(),
                    Math.round(paid * 100.0) / 100.0,
                    Math.round(equalShare * 100.0) / 100.0,
                    Math.round(net * 100.0) / 100.0
            ));

            if (net < -0.01) {
                debtors.add(new AbstractMap.SimpleEntry<>(m.getUser().getFullName(), -net));
            } else if (net > 0.01) {
                creditors.add(new AbstractMap.SimpleEntry<>(m.getUser().getFullName(), net));
            }
        }

        // Calculate simplified transfer settlements
        List<SettlementDTO.TransferProposal> transfers = new ArrayList<>();
        int dIdx = 0, cIdx = 0;
        while (dIdx < debtors.size() && cIdx < creditors.size()) {
            var debtor = debtors.get(dIdx);
            var creditor = creditors.get(cIdx);

            double amount = Math.min(debtor.getValue(), creditor.getValue());
            transfers.add(new SettlementDTO.TransferProposal(
                    debtor.getKey(),
                    creditor.getKey(),
                    Math.round(amount * 100.0) / 100.0
            ));

            debtor.setValue(debtor.getValue() - amount);
            creditor.setValue(creditor.getValue() - amount);

            if (debtor.getValue() < 0.01) dIdx++;
            if (creditor.getValue() < 0.01) cIdx++;
        }

        SettlementDTO result = new SettlementDTO();
        result.setTripId(tripId);
        result.setTotalExpenses(Math.round(total * 100.0) / 100.0);
        result.setTotalMembers(memberCount);
        result.setEqualSharePerMember(Math.round(equalShare * 100.0) / 100.0);
        result.setMemberBalances(memberBalances);
        result.setSettlements(transfers);

        return result;
    }

    public TripMemberDTO mapToDTO(TripMember m) {
        TripMemberDTO dto = new TripMemberDTO();
        dto.setId(m.getId());
        dto.setTripId(m.getTrip().getId());
        dto.setUserId(m.getUser().getId());
        dto.setFullName(m.getUser().getFullName());
        dto.setEmail(m.getUser().getEmail());
        dto.setAvatarUrl(m.getUser().getAvatarUrl());
        dto.setGroupRole(m.getGroupRole());
        dto.setInviteStatus(m.getInviteStatus());
        dto.setJoinedAt(m.getJoinedAt());
        return dto;
    }
}
