package com.tripnest.service;

import com.tripnest.dto.AuthRequest;
import com.tripnest.dto.AuthResponse;
import com.tripnest.dto.RegisterRequest;
import com.tripnest.entity.Role;
import com.tripnest.entity.User;
import com.tripnest.exception.BadRequestException;
import com.tripnest.repository.UserRepository;
import com.tripnest.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setEmail("explorer@tripnest.com");
        registerRequest.setPassword("securePass123");
        registerRequest.setFullName("John Explorer");
        registerRequest.setRole(Role.ROLE_TRAVELER);
    }

    @Test
    void testRegisterUser_Success() {
        when(userRepository.existsByEmail("explorer@tripnest.com")).thenReturn(false);
        when(passwordEncoder.encode("securePass123")).thenReturn("encodedPassword");

        User savedUser = new User("explorer@tripnest.com", "encodedPassword", "John Explorer", Role.ROLE_TRAVELER);
        savedUser.setId(10L);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(tokenProvider.generateTokenFromEmail(any(), any(), any(), any())).thenReturn("mocked.jwt.token");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("explorer@tripnest.com", response.getEmail());
        assertEquals("John Explorer", response.getFullName());
        assertEquals("mocked.jwt.token", response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUser_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByEmail("explorer@tripnest.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }
}
