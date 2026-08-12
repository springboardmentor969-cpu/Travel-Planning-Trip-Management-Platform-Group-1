package com.tripnest.service;

import com.tripnest.dto.DiscussionMessageResponse;
import com.tripnest.dto.GroupMemberResponse;
import com.tripnest.dto.GroupResponse;
import com.tripnest.entity.DiscussionMessage;
import com.tripnest.entity.Notification;
import com.tripnest.entity.Trip;
import com.tripnest.entity.TripExpense;
import com.tripnest.entity.TripMember;
import com.tripnest.entity.User;
import com.tripnest.exception.ApiException;
import com.tripnest.repository.DiscussionMessageRepository;
import com.tripnest.repository.NotificationRepository;
import com.tripnest.repository.TripExpenseRepository;
import com.tripnest.repository.TripMemberRepository;
import com.tripnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final TripMemberRepository memberRepository;
    private final DiscussionMessageRepository discussionRepository;
    private final UserRepository userRepository;
    private final TripExpenseRepository expenseRepository;
    private final NotificationRepository notificationRepository;
    private final TripAccessService tripAccessService;

    public GroupResponse getGroup(Long userId, Long tripId) {
        Trip trip = tripAccessService.findAccessibleTrip(userId, tripId);
        List<TripMember> dbMembers = memberRepository.findByTripId(tripId);

        List<GroupMemberResponse> membersList = new ArrayList<>();

        // Add owner first
        User owner = trip.getOwner();
        GroupMemberResponse ownerResp = GroupMemberResponse.builder()
                .id(-owner.getId())
                .userId(owner.getId())
                .name(owner.getName() != null ? owner.getName() : owner.getEmail())
                .email(owner.getEmail())
                .role("OWNER")
                .status("ACCEPTED")
                .joinedAt(trip.getStartDate() != null ? trip.getStartDate().atStartOfDay() : LocalDateTime.now())
                .build();
        membersList.add(ownerResp);

        for (TripMember m : dbMembers) {
            // Skip owner if already present in db
            if (m.getUser() != null && m.getUser().getId().equals(owner.getId())) {
                continue;
            }
            if (m.getEmail().equalsIgnoreCase(owner.getEmail())) {
                continue;
            }
            membersList.add(GroupMemberResponse.from(m));
        }

        return GroupResponse.builder().members(membersList).build();
    }

    @Transactional
    public GroupMemberResponse inviteMember(Long userId, Long tripId, String email) {
        Trip trip = tripAccessService.findAccessibleTrip(userId, tripId);
        User inviter = userRepository.findById(userId).orElse(null);

        if (email.equalsIgnoreCase(trip.getOwner().getEmail()) || (inviter != null && email.equalsIgnoreCase(inviter.getEmail()))) {
            throw ApiException.badRequest("You cannot invite yourself to the trip.");
        }

        Optional<TripMember> existingOpt = memberRepository.findByTripIdAndEmailIgnoreCase(tripId, email);
        TripMember member;

        if (existingOpt.isPresent()) {
            TripMember existing = existingOpt.get();
            if ("ACCEPTED".equalsIgnoreCase(existing.getStatus())) {
                throw ApiException.conflict("User is already a member of this trip.");
            } else if ("PENDING".equalsIgnoreCase(existing.getStatus())) {
                throw ApiException.conflict("User already has a pending invitation for this trip.");
            } else {
                // Member previously rejected; re-invite them
                member = existing;
                member.setStatus("PENDING");
                member.setJoinedAt(LocalDateTime.now());
            }
        } else {
            member = TripMember.builder()
                    .email(email)
                    .name(email.contains("@") ? email.split("@")[0] : email)
                    .role("MEMBER")
                    .status("PENDING")
                    .joinedAt(LocalDateTime.now())
                    .trip(trip)
                    .build();
        }

        String inviterName = inviter != null && inviter.getName() != null
                ? inviter.getName()
                : (trip.getOwner().getName() != null ? trip.getOwner().getName() : trip.getOwner().getEmail());

        Optional<User> invitedUserOpt = userRepository.findByEmail(email);
        invitedUserOpt.ifPresent(invitedUser -> {
            member.setUser(invitedUser);
            member.setName(invitedUser.getName() != null ? invitedUser.getName() : member.getName());

            // Send notification to invited user
            Notification notification = Notification.builder()
                    .user(invitedUser)
                    .title("Group Trip Invitation 👥")
                    .message(String.format("You have been invited by %s to join the trip to '%s'.",
                            inviterName,
                            trip.getDestination()))
                    .type("GROUP_INVITATION")
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();
            notificationRepository.save(notification);
        });

        memberRepository.save(member);
        return GroupMemberResponse.from(member);
    }

    @Transactional
    public void removeMember(Long userId, Long tripId, Long memberId) {
        tripAccessService.findAccessibleTrip(userId, tripId);
        TripMember member = memberRepository.findByTripIdAndId(tripId, memberId)
                .orElseThrow(() -> ApiException.notFound("Group member not found."));

        memberRepository.delete(member);
    }

    @Transactional
    public GroupMemberResponse updateMemberRole(Long userId, Long tripId, Long memberId, String role) {
        tripAccessService.findAccessibleTrip(userId, tripId);
        TripMember member = memberRepository.findByTripIdAndId(tripId, memberId)
                .orElseThrow(() -> ApiException.notFound("Group member not found."));

        member.setRole(role);
        memberRepository.save(member);
        return GroupMemberResponse.from(member);
    }

    @Transactional
    public GroupMemberResponse acceptInvitation(Long userId, Long invitationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found."));

        TripMember member = memberRepository.findById(invitationId)
                .orElseThrow(() -> ApiException.notFound("Invitation not found."));

        if (!member.getEmail().equalsIgnoreCase(user.getEmail()) &&
            (member.getUser() == null || !member.getUser().getId().equals(userId))) {
            throw ApiException.forbidden("You do not have permission to accept this invitation.");
        }

        member.setStatus("ACCEPTED");
        member.setUser(user);
        member.setJoinedAt(LocalDateTime.now());
        memberRepository.save(member);

        // Notify trip owner
        Trip trip = member.getTrip();
        if (trip != null && trip.getOwner() != null && !trip.getOwner().getId().equals(userId)) {
            Notification notification = Notification.builder()
                    .user(trip.getOwner())
                    .title("Invitation Accepted 🎉")
                    .message(String.format("%s accepted your invitation to join '%s'.",
                            user.getName() != null ? user.getName() : user.getEmail(),
                            trip.getDestination()))
                    .type("GROUP_INVITATION")
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();
            notificationRepository.save(notification);
        }

        return GroupMemberResponse.from(member);
    }

    @Transactional
    public void rejectInvitation(Long userId, Long invitationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found."));

        TripMember member = memberRepository.findById(invitationId)
                .orElseThrow(() -> ApiException.notFound("Invitation not found."));

        if (!member.getEmail().equalsIgnoreCase(user.getEmail()) &&
            (member.getUser() == null || !member.getUser().getId().equals(userId))) {
            throw ApiException.forbidden("You do not have permission to reject this invitation.");
        }

        member.setStatus("REJECTED");
        memberRepository.save(member);

        // Notify trip owner
        Trip trip = member.getTrip();
        if (trip != null && trip.getOwner() != null && !trip.getOwner().getId().equals(userId)) {
            Notification notification = Notification.builder()
                    .user(trip.getOwner())
                    .title("Invitation Declined ❌")
                    .message(String.format("%s declined your invitation to join '%s'.",
                            user.getName() != null ? user.getName() : user.getEmail(),
                            trip.getDestination()))
                    .type("GROUP_INVITATION")
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();
            notificationRepository.save(notification);
        }
    }

    public List<GroupMemberResponse> getPendingInvitations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found."));

        List<TripMember> byUser = memberRepository.findByUserIdAndStatus(userId, "PENDING");
        List<TripMember> byEmail = memberRepository.findByEmailIgnoreCaseAndStatus(user.getEmail(), "PENDING");

        List<TripMember> combined = new ArrayList<>(byUser);
        for (TripMember m : byEmail) {
            if (combined.stream().noneMatch(existing -> existing.getId().equals(m.getId()))) {
                combined.add(m);
            }
        }

        return combined.stream().map(GroupMemberResponse::from).toList();
    }

    public List<DiscussionMessageResponse> getDiscussionMessages(Long userId, Long tripId) {
        tripAccessService.findAccessibleTrip(userId, tripId);
        return discussionRepository.findByTripIdOrderByCreatedAtAsc(tripId).stream()
                .map(DiscussionMessageResponse::from)
                .toList();
    }

    @Transactional
    public DiscussionMessageResponse postDiscussionMessage(Long userId, Long tripId, String messageText) {
        Trip trip = tripAccessService.findAccessibleTrip(userId, tripId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found."));

        DiscussionMessage message = DiscussionMessage.builder()
                .message(messageText)
                .createdAt(LocalDateTime.now())
                .trip(trip)
                .sender(user)
                .build();

        discussionRepository.save(message);
        return DiscussionMessageResponse.from(message);
    }

    public List<Map<String, Object>> getSharedExpenseSettlement(Long userId, Long tripId) {
        Trip trip = tripAccessService.findAccessibleTrip(userId, tripId);
        List<TripExpense> expenses = expenseRepository.findByTripIdOrderByDateDesc(tripId);

        if (expenses.isEmpty()) {
            return List.of();
        }

        GroupResponse groupResp = getGroup(userId, tripId);
        List<GroupMemberResponse> members = groupResp.getMembers();
        int memberCount = members.size();
        if (memberCount <= 1) {
            return List.of();
        }

        double totalSpent = expenses.stream().mapToDouble(TripExpense::getAmount).sum();
        double targetPerPerson = totalSpent / memberCount;

        Map<String, Double> paidMap = new HashMap<>();
        for (GroupMemberResponse m : members) {
            paidMap.put(m.getName(), 0.0);
        }

        for (TripExpense e : expenses) {
            String payer = e.getPaidBy() != null && !e.getPaidBy().isBlank()
                    ? e.getPaidBy()
                    : (trip.getOwner().getName() != null ? trip.getOwner().getName() : trip.getOwner().getEmail());
            paidMap.put(payer, paidMap.getOrDefault(payer, 0.0) + e.getAmount());
        }

        Map<String, Double> balanceMap = new HashMap<>();
        for (Map.Entry<String, Double> entry : paidMap.entrySet()) {
            balanceMap.put(entry.getKey(), entry.getValue() - targetPerPerson);
        }

        List<Map.Entry<String, Double>> debtors = new ArrayList<>();
        List<Map.Entry<String, Double>> creditors = new ArrayList<>();

        for (Map.Entry<String, Double> entry : balanceMap.entrySet()) {
            if (entry.getValue() < -0.01) {
                debtors.add(Map.entry(entry.getKey(), -entry.getValue()));
            } else if (entry.getValue() > 0.01) {
                creditors.add(Map.entry(entry.getKey(), entry.getValue()));
            }
        }

        List<Map<String, Object>> settlements = new ArrayList<>();
        int dIdx = 0, cIdx = 0;

        while (dIdx < debtors.size() && cIdx < creditors.size()) {
            Map.Entry<String, Double> debtor = debtors.get(dIdx);
            Map.Entry<String, Double> creditor = creditors.get(cIdx);

            double amount = Math.min(debtor.getValue(), creditor.getValue());

            Map<String, Object> s = new HashMap<>();
            s.put("fromUser", debtor.getKey());
            s.put("toUser", creditor.getKey());
            s.put("amount", Math.round(amount * 100.0) / 100.0);
            settlements.add(s);

            if (debtor.getValue() - amount < 0.01) {
                dIdx++;
            } else {
                debtors.set(dIdx, Map.entry(debtor.getKey(), debtor.getValue() - amount));
            }

            if (creditor.getValue() - amount < 0.01) {
                cIdx++;
            } else {
                creditors.set(cIdx, Map.entry(creditor.getKey(), creditor.getValue() - amount));
            }
        }

        return settlements;
    }
}
