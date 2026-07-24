package com.tripnest.security;

import com.tripnest.entity.Role;
import com.tripnest.entity.User;
import com.tripnest.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        org.springframework.security.core.Authentication authentication)
            throws IOException, ServletException {

        OAuth2AuthenticationToken token =
                (OAuth2AuthenticationToken) authentication;

        String email = token.getPrincipal().getAttribute("email");
        String fullName = token.getPrincipal().getAttribute("name");

        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;

        if (existingUser.isPresent()) {

            user = existingUser.get();

        } else {

            user = User.builder()
                    .fullName(fullName)
                    .email(email)
                    .role(Role.TRAVELER)
                    .verified(true)
                    .build();

            userRepository.save(user);

        }

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(user.getEmail());

        String jwt = jwtService.generateToken(
                userDetails,
                user.getId(),
                user.getRole().name()
        );

        response.sendRedirect(
                "http://localhost:5173/oauth-success?token=" + jwt
        );

    }
}