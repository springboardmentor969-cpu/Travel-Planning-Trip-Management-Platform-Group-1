package com.tripnest.controller;

import com.tripnest.dto.ApiResponse;
import com.tripnest.dto.SettlementDTO;
import com.tripnest.dto.TripMemberDTO;
import com.tripnest.entity.TripMember;
import com.tripnest.entity.User;
import com.tripnest.service.TripMemberService;
import com.tripnest.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips/{tripId}/members")
public class TripMemberController {

    private final TripMemberService tripMemberService;
    private final UserService userService;

    public TripMemberController(TripMemberService tripMemberService, UserService userService) {
        this.tripMemberService = tripMemberService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TripMemberDTO>>> getTripMembers(@PathVariable Long tripId) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        List<TripMemberDTO> members = tripMemberService.getTripMembers(tripId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Members retrieved successfully", members));
    }

    @PostMapping("/invite")
    public ResponseEntity<ApiResponse<TripMemberDTO>> inviteMember(
            @PathVariable Long tripId,
            @RequestBody Map<String, String> request) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        String email = request.get("email");
        String roleStr = request.getOrDefault("role", "MEMBER");
        TripMember.GroupRole role = TripMember.GroupRole.valueOf(roleStr);

        TripMemberDTO member = tripMemberService.inviteMember(tripId, email, role, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Invitation sent successfully", member));
    }

    @PutMapping("/respond")
    public ResponseEntity<ApiResponse<TripMemberDTO>> respondToInvitation(
            @PathVariable Long tripId,
            @RequestBody Map<String, String> request) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        String statusStr = request.get("status");
        TripMember.InviteStatus status = TripMember.InviteStatus.valueOf(statusStr);

        TripMemberDTO member = tripMemberService.respondToInvitation(tripId, status, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Invitation status updated", member));
    }

    @DeleteMapping("/{memberUserId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable Long tripId,
            @PathVariable Long memberUserId) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        tripMemberService.removeMember(tripId, memberUserId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Member removed successfully"));
    }

    @GetMapping("/settlement")
    public ResponseEntity<ApiResponse<SettlementDTO>> getSettlements(@PathVariable Long tripId) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        SettlementDTO settlements = tripMemberService.calculateSettlements(tripId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Settlements calculated successfully", settlements));
    }
}
