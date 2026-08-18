package com.tripnest.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String content) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("notifications@tripnest.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);

            // Attempt to send, or log if mail server not running
            mailSender.send(message);
            logger.info("Email successfully sent to {}", to);
        } catch (Exception e) {
            logger.warn("Could not dispatch live email to {} (Fallback logger active): Subject: '{}', Body: '{}'. Cause: {}",
                    to, subject, content, e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String to, String resetToken) {
        String resetUrl = "http://localhost:5173/reset-password?token=" + resetToken;
        String content = "Hello,\n\nYou requested a password reset for your TripNest account.\n" +
                "Click the link below to set a new password (valid for 1 hour):\n\n" +
                resetUrl + "\n\n" +
                "If you did not request this, please ignore this email.\n\nHappy travels,\nTripNest Team";
        sendEmail(to, "TripNest — Password Reset Request", content);
    }

    public void sendTripInviteEmail(String to, String inviterName, String tripTitle, String inviteUrl) {
        String content = "Hello,\n\n" + inviterName + " has invited you to join the trip \"" + tripTitle + "\" on TripNest!\n" +
                "Click the link below to view and accept your invitation:\n\n" +
                inviteUrl + "\n\n" +
                "TripNest Team";
        sendEmail(to, "TripNest — You're Invited to: " + tripTitle, content);
    }
}
