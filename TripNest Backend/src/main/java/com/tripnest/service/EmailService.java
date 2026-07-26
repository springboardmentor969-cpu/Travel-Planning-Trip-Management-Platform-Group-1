package com.tripnest.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.oauth2.redirect-uri}")
    private String frontendBaseHint; // reused just to infer scheme/host in dev; replace with a dedicated app.frontend-url if preferred

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String frontendOrigin = frontendBaseHint.replace("/oauth2/callback", "");
        String resetLink = frontendOrigin + "/reset-password?token=" + resetToken;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Reset your TripNest password");
        message.setText(
                "We received a request to reset your TripNest password.\n\n" +
                        "Click the link below to choose a new password. This link expires in 1 hour.\n\n" +
                        resetLink + "\n\n" +
                        "If you didn't request this, you can safely ignore this email."
        );

        try {
            mailSender.send(message);
        } catch (Exception e) {
            // Don't fail the request just because email delivery had an issue —
            // log it so an admin can investigate, but the reset token still exists.
            log.error("Failed to send password reset email to {}", toEmail, e);
        }
    }
}