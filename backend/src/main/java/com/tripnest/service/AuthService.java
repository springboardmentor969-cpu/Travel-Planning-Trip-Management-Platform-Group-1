package com.tripnest.service;

import com.tripnest.dto.*;
import com.tripnest.entity.Role;
import com.tripnest.entity.User;
import com.tripnest.exception.ApiException;
import com.tripnest.repository.UserRepository;
import com.tripnest.security.CustomUserDetailsService;
import com.tripnest.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final EmailService emailService;


    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        Role role = Role.TRAVELER;
        if (request.getRole() != null && !request.getRole().isBlank()) {
            try {
                role = Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Role must be TRAVELER, GROUP_ADMIN, or ADMIN");
            }
        }

       User user = User.builder()
        .fullName(request.getFullName())
        .email(request.getEmail().toLowerCase())
        .password(passwordEncoder.encode(request.getPassword()))
        .role(role)
        .verified(false)
        .verificationToken(UUID.randomUUID().toString())
        .verificationTokenExpiry(LocalDateTime.now().plusHours(24))
        .build();

        userRepository.save(user);

// Send verification email
emailService.sendVerificationEmail(user);

// Return success response (no JWT until verified)
return AuthResponse.builder()
        .userId(user.getId())
        .fullName(user.getFullName())
        .email(user.getEmail())
        .role(user.getRole().name())
        .build();
    }


    @Transactional
public void verifyEmail(String token) {

    User user = userRepository.findByVerificationToken(token)
            .orElseThrow(() ->
                    new ApiException(
                            HttpStatus.BAD_REQUEST,
                            "Invalid verification link."
                    )
            );

    if (user.getVerificationTokenExpiry() == null ||
            user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {

        throw new ApiException(
                HttpStatus.BAD_REQUEST,
                "Verification link has expired."
        );
    }

    user.setVerified(true);
    user.setVerificationToken(null);
    user.setVerificationTokenExpiry(null);

    userRepository.save(user);
}

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
                request.getEmail().toLowerCase(),
                request.getPassword()
        )
);

User user = userRepository.findByEmail(request.getEmail().toLowerCase())
        .orElseThrow(() -> new ApiException(
                HttpStatus.UNAUTHORIZED,
                "Invalid email or password"
        ));

if (!user.isVerified()) {
    throw new ApiException(
            HttpStatus.UNAUTHORIZED,
            "Please verify your email before logging in."
    );
}

return buildAuthResponse(user);
    }

    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "No account with that email"));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
        userRepository.save(user);
        emailService.sendPasswordResetEmail(user);


        // TODO: wire this into the Notification module (JavaMailSender) once it's built,
        // instead of returning the token directly. Returned here so it's testable today.
       return "Reset email sent successfully.";
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Invalid or expired reset token"));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "This reset link has expired. Request a new one.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails, user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
