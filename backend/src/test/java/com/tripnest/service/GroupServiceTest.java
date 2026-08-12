package com.tripnest.service;

import com.tripnest.dto.GroupMemberResponse;
import com.tripnest.dto.GroupResponse;
import com.tripnest.entity.Trip;
import com.tripnest.entity.TripExpense;
import com.tripnest.entity.TripMember;
import com.tripnest.entity.User;
import com.tripnest.repository.DiscussionMessageRepository;
import com.tripnest.repository.NotificationRepository;
import com.tripnest.repository.TripExpenseRepository;
import com.tripnest.repository.TripMemberRepository;
import com.tripnest.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GroupServiceTest {

    @Mock
    private TripMemberRepository memberRepository;

    @Mock
    private DiscussionMessageRepository discussionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TripExpenseRepository expenseRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private TripAccessService tripAccessService;

    @InjectMocks
    private GroupService groupService;

    private Trip testTrip;
    private User owner;

    @BeforeEach
    void setUp() {
        owner = User.builder().id(1L).email("owner@example.com").name("Trip Owner").build();
        testTrip = Trip.builder().id(10L).destination("Tokyo").owner(owner).build();
    }

    @Test
    void getGroup_returnsMembersListWithTripOwner() {
        when(tripAccessService.findAccessibleTrip(1L, 10L)).thenReturn(testTrip);
        TripMember member = TripMember.builder().id(2L).email("friend@example.com").name("Friend").role("MEMBER").status("ACCEPTED").build();
        when(memberRepository.findByTripId(10L)).thenReturn(List.of(member));

        GroupResponse response = groupService.getGroup(1L, 10L);

        assertNotNull(response);
        assertEquals(2, response.getMembers().size());
        assertEquals("OWNER", response.getMembers().get(0).getRole());
        assertEquals("Trip Owner", response.getMembers().get(0).getName());
    }

    @Test
    void getSharedExpenseSettlement_calculatesEqualSplitDebtsCorrectly() {
        when(tripAccessService.findAccessibleTrip(1L, 10L)).thenReturn(testTrip);
        TripMember member = TripMember.builder().id(2L).email("friend@example.com").name("Friend").role("MEMBER").status("ACCEPTED").build();
        when(memberRepository.findByTripId(10L)).thenReturn(List.of(member));

        TripExpense e1 = TripExpense.builder().id(100L).amount(1000.0).paidBy("Trip Owner").trip(testTrip).build();
        when(expenseRepository.findByTripIdOrderByDateDesc(10L)).thenReturn(List.of(e1));

        List<Map<String, Object>> settlements = groupService.getSharedExpenseSettlement(1L, 10L);

        assertNotNull(settlements);
        assertEquals(1, settlements.size());
        assertEquals("Friend", settlements.get(0).get("fromUser"));
        assertEquals("Trip Owner", settlements.get(0).get("toUser"));
        assertEquals(500.0, settlements.get(0).get("amount"));
    }

    @Test
    void inviteMember_createsMemberAndNotificationForRegisteredUser() {
        when(tripAccessService.findAccessibleTrip(1L, 10L)).thenReturn(testTrip);
        when(userRepository.findById(1L)).thenReturn(Optional.of(owner));
        when(memberRepository.findByTripIdAndEmailIgnoreCase(10L, "invited@example.com")).thenReturn(Optional.empty());

        User invitedUser = User.builder().id(3L).email("invited@example.com").name("Invited User").build();
        when(userRepository.findByEmail("invited@example.com")).thenReturn(Optional.of(invitedUser));

        GroupMemberResponse response = groupService.inviteMember(1L, 10L, "invited@example.com");

        assertNotNull(response);
        assertEquals("invited@example.com", response.getEmail());
        assertEquals(10L, response.getTripId());
        assertEquals("Tokyo", response.getTripDestination());
        verify(notificationRepository, times(1)).save(any());
        verify(memberRepository, times(1)).save(any());
    }

    @Test
    void acceptInvitation_updatesStatusToAcceptedAndNotifiesOwner() {
        User invitedUser = User.builder().id(3L).email("invited@example.com").name("Invited User").build();
        when(userRepository.findById(3L)).thenReturn(Optional.of(invitedUser));

        TripMember member = TripMember.builder()
                .id(20L)
                .email("invited@example.com")
                .role("MEMBER")
                .status("PENDING")
                .trip(testTrip)
                .build();
        when(memberRepository.findById(20L)).thenReturn(Optional.of(member));

        GroupMemberResponse response = groupService.acceptInvitation(3L, 20L);

        assertNotNull(response);
        assertEquals("ACCEPTED", member.getStatus());
        verify(notificationRepository, times(1)).save(any());
        verify(memberRepository, times(1)).save(member);
    }

    @Test
    void rejectInvitation_updatesStatusToRejectedAndNotifiesOwner() {
        User invitedUser = User.builder().id(3L).email("invited@example.com").name("Invited User").build();
        when(userRepository.findById(3L)).thenReturn(Optional.of(invitedUser));

        TripMember member = TripMember.builder()
                .id(20L)
                .email("invited@example.com")
                .role("MEMBER")
                .status("PENDING")
                .trip(testTrip)
                .build();
        when(memberRepository.findById(20L)).thenReturn(Optional.of(member));

        groupService.rejectInvitation(3L, 20L);

        assertEquals("REJECTED", member.getStatus());
        verify(notificationRepository, times(1)).save(any());
        verify(memberRepository, times(1)).save(member);
    }
}
