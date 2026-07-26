package com.tripnest.service;

import com.tripnest.dto.*;
import com.tripnest.entity.AuthProvider;
import com.tripnest.entity.PasswordResetToken;
import com.tripnest.entity.RefreshToken;
import com.tripnest.entity.Role;
import com.tripnest.entity.User;
import com.tripnest.exception.ApiException;
import com.tripnest.repository.PasswordResetTokenRepository;
import com.tripnest.repository.RefreshTokenRepository;
import com.tripnest.repository.UserRepository;
import com.tripnest.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw ApiException.conflict("An account with this email already exists.");
        }

        // Self-registration can only create Traveler or Group Admin accounts;
        // Administrator accounts are provisioned separately by the platform team.
        Role role = request.getRole() == Role.ADMINISTRATOR || request.getRole() == null
                ? Role.TRAVELER
                : request.getRole();

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .provider(AuthProvider.LOCAL)
                .build();

        userRepository.save(user);
        return UserResponse.from(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> ApiException.unauthorized("Invalid email or password."));

        if (user.getPassword() == null
                || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw ApiException.unauthorized("Invalid email or password.");
        }

        return buildAuthResponse(user);
    }

    @Transactional
    public TokenRefreshResponse refresh(RefreshTokenRequest request) {
        RefreshToken oldToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> ApiException.unauthorized("Session expired. Please sign in again."));

        if (oldToken.isExpired()) {
            refreshTokenRepository.delete(oldToken);
            throw ApiException.unauthorized("Session expired. Please sign in again.");
        }

        User user = oldToken.getUser();
        String newAccessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());

        // Rotate the refresh token so a leaked token can't be reused indefinitely.
        refreshTokenRepository.delete(oldToken);
        RefreshToken newRefreshToken = RefreshToken.builder()
                .user(user)
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .build();
        refreshTokenRepository.save(newRefreshToken);

        return TokenRefreshResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken.getToken())
                .build();
    }

    @Transactional
    public void logout(RefreshTokenRequest request) {
        refreshTokenRepository.findByToken(request.getRefreshToken())
                .ifPresent(refreshTokenRepository::delete);
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .user(user)
                    .expiryDate(Instant.now().plus(1, ChronoUnit.HOURS))
                    .build();
            passwordResetTokenRepository.save(resetToken);
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken.getToken());
        });
        // Intentionally do nothing (and never throw) if the email isn't found —
        // the controller always returns success so we don't leak which emails are registered.
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> ApiException.badRequest("This reset link is invalid or has expired."));

        if (!resetToken.isValid()) {
            throw ApiException.badRequest("This reset link is invalid or has expired.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        // Invalidate existing sessions so the old password's tokens stop working.
        refreshTokenRepository.deleteByUser(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .user(UserResponse.from(user))
                .build();
    }
}