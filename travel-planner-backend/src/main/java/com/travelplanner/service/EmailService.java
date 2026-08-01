package com.travelplanner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        System.out.println("====== [EMAIL LOG] ======");
        System.out.println("To: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Body:\n" + body);
        System.out.println("=========================");

        if (mailSender == null) {
            System.out.println("[WARNING] JavaMailSender is not configured. Email logged to console.");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.println("[SUCCESS] Email sent successfully via JavaMailSender.");
        } catch (Exception e) {
            System.out.println("[ERROR] Failed to send email via SMTP: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String to, String name) {
        String subject = "Welcome to TripPlanner!";
        String body = "Hi " + name + ",\n\n" +
                "Welcome to TripPlanner - Navigate Your Next Adventure!\n\n" +
                "We are thrilled to help you design custom itineraries, monitor budget limits, " +
                "and collaborate seamlessly with co-planners.\n\n" +
                "Start planning your dream trip today!\n\n" +
                "Best Regards,\nThe TripPlanner Team";
        sendEmail(to, subject, body);
    }

    public void sendCollaborationInvite(String to, String inviteeName, String ownerName, String tripTitle) {
        String subject = "Collaboration Invite: Plan " + tripTitle + " together!";
        String body = "Hi " + inviteeName + ",\n\n" +
                ownerName + " has invited you to collaborate on the trip: \"" + tripTitle + "\".\n\n" +
                "Log into your TripPlanner Dashboard to view the shared itinerary, log expenses, and update coordinates.\n\n" +
                "Let's make this trip unforgettable!\n\n" +
                "Best Regards,\nThe TripPlanner Team";
        sendEmail(to, subject, body);
    }

    public void sendBudgetAlert(String to, String tripTitle, double currentExpenses, double limitAmount) {
        String subject = "⚠️ Budget Threshold Warning: " + tripTitle;
        String body = "Hi Travel planner,\n\n" +
                "This is a system notification that expenses logged on your trip \"" + tripTitle + "\" " +
                "have reached " + currentExpenses + " which is over 90% of your set limit: " + limitAmount + ".\n\n" +
                "Please review your budget workspace to optimize your financial records.\n\n" +
                "Best Regards,\nThe TripPlanner Team";
        sendEmail(to, subject, body);
    }
}
