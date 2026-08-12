package com.tripnest.controller;

import com.tripnest.dto.TripDetailsDto;
import com.tripnest.dto.TripDto;
import com.tripnest.dto.UserDto;
import com.tripnest.dto.CollaboratorInviteRequest;
import com.tripnest.dto.TripInvitationDto;
import com.tripnest.service.TripInvitationService;
import com.tripnest.service.TripService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trips")
public class TripController {
    private final TripService tripService;
    private final TripInvitationService tripInvitationService;

    public TripController(TripService tripService, TripInvitationService tripInvitationService) {
        this.tripService = tripService;
        this.tripInvitationService = tripInvitationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TripDto> create(@Valid @RequestBody TripDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tripService.create(dto));
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<TripDto>> list(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(tripService.list(userId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TripDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.get(id));
    }

    @GetMapping("/{id}/details")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TripDetailsDto> getDetails(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.getDetails(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TripDto> update(@PathVariable Long id, @Valid @RequestBody TripDto dto) {
        return ResponseEntity.ok(tripService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tripService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/collaborators")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<UserDto>> listCollaborators(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.listCollaborators(id));
    }

    @GetMapping("/{id}/invites")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<TripInvitationDto>> listInvites(@PathVariable Long id) {
        return ResponseEntity.ok(tripInvitationService.listForTrip(id));
    }

    @PostMapping("/{id}/invites")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TripInvitationDto> inviteCollaborator(
            @PathVariable Long id,
            @Valid @RequestBody CollaboratorInviteRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tripInvitationService.invite(id, request.email()));
    }

    @DeleteMapping("/{id}/collaborators/{collaboratorId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<UserDto>> removeCollaborator(@PathVariable Long id, @PathVariable Long collaboratorId) {
        tripInvitationService.removeCollaborator(id, collaboratorId);
        return ResponseEntity.noContent().build();
    }
}
