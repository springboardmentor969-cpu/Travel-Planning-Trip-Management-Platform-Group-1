package com.tripnest.controller;

import com.tripnest.dto.ChangePasswordRequest;
import com.tripnest.dto.DestinationResponse;
import com.tripnest.dto.FavoriteRequest;
import com.tripnest.dto.UpdateProfileRequest;
import com.tripnest.dto.UserResponse;
import com.tripnest.security.CustomUserPrincipal;
import com.tripnest.service.DestinationService;
import com.tripnest.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final DestinationService destinationService;

    // GET /api/users/me
    @GetMapping
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(userService.getProfile(principal.getId()));
    }

    // PUT /api/users/me
    @PutMapping
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(userService.updateProfile(principal.getId(), request));
    }

    // PUT /api/users/me/password
    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(principal.getId(), request);
        return ResponseEntity.noContent().build();
    }

    // GET /api/users/me/favorite-destinations
    @GetMapping("/favorite-destinations")
    public ResponseEntity<List<DestinationResponse>> getFavoriteDestinations(
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        return ResponseEntity.ok(destinationService.getFavorites(principal.getId()));
    }

    // POST /api/users/me/favorite-destinations
    @PostMapping("/favorite-destinations")
    public ResponseEntity<DestinationResponse> addFavoriteDestination(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @Valid @RequestBody FavoriteRequest request
    ) {
        DestinationResponse response =
                destinationService.addFavorite(principal.getId(), request.getDestinationId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // DELETE /api/users/me/favorite-destinations/:destinationId
    @DeleteMapping("/favorite-destinations/{destinationId}")
    public ResponseEntity<Void> removeFavoriteDestination(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long destinationId
    ) {
        destinationService.removeFavorite(principal.getId(), destinationId);
        return ResponseEntity.noContent().build();
    }
}