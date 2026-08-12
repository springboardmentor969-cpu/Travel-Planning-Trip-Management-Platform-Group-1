package com.tripnest.controller;

import com.tripnest.dto.DiscussionMessageResponse;
import com.tripnest.dto.GroupMemberResponse;
import com.tripnest.dto.GroupResponse;
import com.tripnest.security.CustomUserPrincipal;
import com.tripnest.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips/{tripId}/group")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    // GET /api/trips/:tripId/group
    @GetMapping
    public ResponseEntity<GroupResponse> getGroup(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId
    ) {
        return ResponseEntity.ok(groupService.getGroup(principal.getId(), tripId));
    }

    // POST /api/trips/:tripId/group/invite
    @PostMapping("/invite")
    public ResponseEntity<GroupMemberResponse> inviteMember(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @RequestBody Map<String, String> payload
    ) {
        String email = payload.get("email");
        GroupMemberResponse response = groupService.inviteMember(principal.getId(), tripId, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // DELETE /api/trips/:tripId/group/members/:memberId
    @DeleteMapping("/members/{memberId}")
    public ResponseEntity<Void> removeMember(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @PathVariable Long memberId
    ) {
        groupService.removeMember(principal.getId(), tripId, memberId);
        return ResponseEntity.noContent().build();
    }

    // PUT /api/trips/:tripId/group/members/:memberId/role
    @PutMapping("/members/{memberId}/role")
    public ResponseEntity<GroupMemberResponse> updateMemberRole(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @PathVariable Long memberId,
            @RequestBody Map<String, String> payload
    ) {
        String role = payload.get("role");
        return ResponseEntity.ok(groupService.updateMemberRole(principal.getId(), tripId, memberId, role));
    }

    // GET /api/trips/:tripId/group/discussions
    @GetMapping("/discussions")
    public ResponseEntity<List<DiscussionMessageResponse>> getDiscussionMessages(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId
    ) {
        return ResponseEntity.ok(groupService.getDiscussionMessages(principal.getId(), tripId));
    }

    // POST /api/trips/:tripId/group/discussions
    @PostMapping("/discussions")
    public ResponseEntity<DiscussionMessageResponse> postDiscussionMessage(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @RequestBody Map<String, String> payload
    ) {
        String message = payload.get("message");
        DiscussionMessageResponse response = groupService.postDiscussionMessage(principal.getId(), tripId, message);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/trips/:tripId/group/shared-expenses
    @GetMapping("/shared-expenses")
    public ResponseEntity<List<Map<String, Object>>> getSharedExpenseSettlement(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId
    ) {
        return ResponseEntity.ok(groupService.getSharedExpenseSettlement(principal.getId(), tripId));
    }
}
