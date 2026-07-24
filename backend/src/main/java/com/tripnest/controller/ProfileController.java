package com.tripnest.controller;

import com.tripnest.dto.ChangePasswordRequest;
import com.tripnest.dto.UpdateProfileRequest;
import com.tripnest.entity.User;
import com.tripnest.exception.ApiException;
import com.tripnest.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Authentication is injected by Spring Security once the JWT filter validates the token
    @GetMapping("/me")
    public ResponseEntity<User> getProfile(Authentication authentication) {
        User user = currentUser(authentication);
        user.setPassword(null); // never send the hash back
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(Authentication authentication, @RequestBody UpdateProfileRequest request) {
        User user = currentUser(authentication);

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getFavoriteDestination() != null) user.setFavoriteDestination(request.getFavoriteDestination());
        if (request.getPhone() != null) user.setPhone(request.getPhone());

        userRepository.save(user);
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me/password")
    public ResponseEntity<Map<String, String>> changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        User user = currentUser(authentication);

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    private User currentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
