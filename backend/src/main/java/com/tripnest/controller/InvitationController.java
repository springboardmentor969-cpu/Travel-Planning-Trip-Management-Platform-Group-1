package com.tripnest.controller;

import com.tripnest.dto.GroupMemberResponse;
import com.tripnest.security.CustomUserPrincipal;
import com.tripnest.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
public class InvitationController {

    private final GroupService groupService;

    // GET /api/invitations/pending
    @GetMapping("/pending")
    public ResponseEntity<List<GroupMemberResponse>> getPendingInvitations(
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        return ResponseEntity.ok(groupService.getPendingInvitations(principal.getId()));
    }

    // POST /api/invitations/{invitationId}/accept
    @PostMapping("/{invitationId}/accept")
    public ResponseEntity<GroupMemberResponse> acceptInvitation(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long invitationId
    ) {
        return ResponseEntity.ok(groupService.acceptInvitation(principal.getId(), invitationId));
    }

    // POST /api/invitations/{invitationId}/reject
    @PostMapping("/{invitationId}/reject")
    public ResponseEntity<Void> rejectInvitation(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long invitationId
    ) {
        groupService.rejectInvitation(principal.getId(), invitationId);
        return ResponseEntity.noContent().build();
    }
}
