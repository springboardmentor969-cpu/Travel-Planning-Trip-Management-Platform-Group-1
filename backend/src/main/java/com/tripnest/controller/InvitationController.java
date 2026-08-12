package com.tripnest.controller;

import com.tripnest.dto.TripInvitationDto;
import com.tripnest.service.TripInvitationService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/invitations")
public class InvitationController {
    private final TripInvitationService tripInvitationService;

    public InvitationController(TripInvitationService tripInvitationService) {
        this.tripInvitationService = tripInvitationService;
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<TripInvitationDto>> mine() {
        return ResponseEntity.ok(tripInvitationService.listForCurrentUser());
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TripInvitationDto> accept(@PathVariable Long id) {
        return ResponseEntity.ok(tripInvitationService.accept(id));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TripInvitationDto> reject(@PathVariable Long id) {
        return ResponseEntity.ok(tripInvitationService.reject(id));
    }
}