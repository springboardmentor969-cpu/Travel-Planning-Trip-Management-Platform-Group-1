package com.tripnest.controller;

import com.tripnest.dto.ApiResponse;
import com.tripnest.dto.NotificationDTO;
import com.tripnest.entity.User;
import com.tripnest.service.NotificationService;
import com.tripnest.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getNotifications() {
        User currentUser = userService.getCurrentAuthenticatedUser();
        List<NotificationDTO> list = notificationService.getUserNotifications(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved successfully", list));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        User currentUser = userService.getCurrentAuthenticatedUser();
        long count = notificationService.getUnreadCount(currentUser);
        Map<String, Long> result = new HashMap<>();
        result.put("unreadCount", count);
        return ResponseEntity.ok(ApiResponse.success("Unread count retrieved", result));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationDTO>> markAsRead(@PathVariable Long id) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        NotificationDTO dto = notificationService.markAsRead(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", dto));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        User currentUser = userService.getCurrentAuthenticatedUser();
        notificationService.markAllAsRead(currentUser);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long id) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        notificationService.deleteNotification(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted successfully"));
    }
}
