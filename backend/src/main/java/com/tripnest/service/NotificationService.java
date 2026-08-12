package com.tripnest.service;

import com.tripnest.dto.NotificationPreferenceResponse;
import com.tripnest.dto.NotificationResponse;
import com.tripnest.entity.Notification;
import com.tripnest.entity.User;
import com.tripnest.exception.ApiException;
import com.tripnest.repository.NotificationRepository;
import com.tripnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<NotificationResponse> getNotifications(Long userId) {
        findUser(userId);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(NotificationResponse::from)
                .toList();
    }

    public long getUnreadCount(Long userId) {
        findUser(userId);
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long userId, Long notificationId) {
        findUser(userId);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> ApiException.notFound("Notification not found."));

        if (!notification.getUser().getId().equals(userId)) {
            throw ApiException.notFound("Notification not found.");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        findUser(userId);
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void deleteNotification(Long userId, Long notificationId) {
        findUser(userId);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> ApiException.notFound("Notification not found."));

        if (!notification.getUser().getId().equals(userId)) {
            throw ApiException.notFound("Notification not found.");
        }

        notificationRepository.delete(notification);
    }

    public NotificationPreferenceResponse getPreferences(Long userId) {
        findUser(userId);
        return NotificationPreferenceResponse.builder()
                .emailNotifications(true)
                .pushNotifications(true)
                .tripReminders(true)
                .promotions(false)
                .build();
    }

    public NotificationPreferenceResponse updatePreferences(Long userId, NotificationPreferenceResponse prefs) {
        findUser(userId);
        return prefs;
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found."));
    }
}
