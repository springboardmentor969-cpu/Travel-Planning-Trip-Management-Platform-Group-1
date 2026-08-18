package com.tripnest.controller;

import com.tripnest.dto.ApiResponse;
import com.tripnest.dto.ChangePasswordRequest;
import com.tripnest.dto.UserProfileDTO;
import com.tripnest.entity.User;
import com.tripnest.service.AuthService;
import com.tripnest.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    public UserController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getCurrentUser() {
        User currentUser = userService.getCurrentAuthenticatedUser();
        UserProfileDTO profile = userService.getProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("User profile fetched successfully", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateProfile(@RequestBody UserProfileDTO profileDTO) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        UserProfileDTO updated = userService.updateProfile(currentUser.getId(), profileDTO);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        authService.changePassword(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }
}
