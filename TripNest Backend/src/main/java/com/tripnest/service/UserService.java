package com.tripnest.service;

import com.tripnest.dto.ChangePasswordRequest;
import com.tripnest.dto.UpdateProfileRequest;
import com.tripnest.dto.UserResponse;
import com.tripnest.entity.User;
import com.tripnest.exception.ApiException;
import com.tripnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse getProfile(Long userId) {
        User user = findUser(userId);
        return UserResponse.from(user);
    }

    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = findUser(userId);

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()
                && !request.getEmail().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw ApiException.conflict("That email is already in use.");
            }
            user.setEmail(request.getEmail());
        }
        if (request.getTravelPreferences() != null) {
            user.setTravelPreferences(request.getTravelPreferences());
        }

        userRepository.save(user);
        return UserResponse.from(user);
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = findUser(userId);

        if (user.getPassword() == null) {
            throw ApiException.badRequest(
                    "This account signs in with Google and has no password to change.");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw ApiException.badRequest("Current password is incorrect.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found."));
    }
}