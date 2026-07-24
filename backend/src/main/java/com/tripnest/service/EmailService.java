package com.tripnest.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.tripnest.entity.User;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(User user) {

        String link =
                "http://localhost:8080/api/auth/verify-email?token="
                        + user.getVerificationToken();

        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setFrom(fromEmail);
        mail.setTo(user.getEmail());

        mail.setSubject("Verify your TripNest Account");

        mail.setText(
                "Hello " + user.getFullName() + ",\n\n"
                        + "Welcome to TripNest!\n\n"
                        + "Please verify your account by clicking the link below:\n\n"
                        + link
                        + "\n\nThis link expires in 24 hours."
        );

        mailSender.send(mail);
    }

 {/*Password reset */}
    public void sendPasswordResetEmail(User user) {

    String link =
            "http://localhost:5173/reset-password?token="
                    + user.getResetToken();

    SimpleMailMessage mail = new SimpleMailMessage();

    mail.setFrom(fromEmail);
    mail.setTo(user.getEmail());

    mail.setSubject("Reset your TripNest Password");

    mail.setText(
            "Hello " + user.getFullName() + ",\n\n"
            + "We received a request to reset your TripNest password.\n\n"
            + "Click the link below to create a new password:\n\n"
            + link
            + "\n\nThis link expires in 30 minutes."
            + "\n\nIf you didn't request this, you can safely ignore this email."
    );

    mailSender.send(mail);

}

}