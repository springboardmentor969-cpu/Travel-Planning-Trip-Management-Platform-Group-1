package com.travelplanner.controller;

import com.travelplanner.entity.Notification;
import com.travelplanner.entity.User;
import com.travelplanner.repository.NotificationRepository;
import com.travelplanner.repository.UserRepository;
import com.travelplanner.security.UserDetailsImpl;
import com.travelplanner.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    // Keep track of active SSE streams mapped to User IDs
    private static final Map<Long, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    @GetMapping
    public ResponseEntity<?> getMyNotifications() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        List<Notification> list = notificationRepository.findByUserId(userDetails.getId());
        
        // Clean proxy references to avoid Jackson lazy load errors
        List<Map<String, Object>> response = new ArrayList<>();
        for (Notification n : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", n.getId());
            map.put("message", n.getMessage());
            map.put("isRead", n.getIsRead());
            map.put("createdAt", n.getCreatedAt());
            response.add(map);
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return ResponseEntity.notFound().build();
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        if (!notification.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Unauthorized action."));
        }
        notification.setIsRead(true);
        notificationRepository.save(notification);
        return ResponseEntity.ok(new MessageResponse("Notification marked as read."));
    }

    @PostMapping
    public ResponseEntity<?> createNotification(@RequestParam Long userId, @RequestParam String message) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setIsRead(false);
        Notification saved = notificationRepository.save(notification);

        // Push real-time alert to active SSE emitters
        pushAlert(userId, message);

        return ResponseEntity.ok(saved);
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamNotifications(@RequestParam Long userId) {
        SseEmitter emitter = new SseEmitter(24 * 60 * 60 * 1000L); // 24 hour timeout
        
        emitters.computeIfAbsent(userId, k -> new CopyOnWriteArrayList<>()).add(emitter);
        
        emitter.onCompletion(() -> removeEmitter(userId, emitter));
        emitter.onTimeout(() -> removeEmitter(userId, emitter));
        emitter.onError((e) -> removeEmitter(userId, emitter));

        try {
            // Send connection success ping
            emitter.send(SseEmitter.event().name("CONNECT").data("SSE notifications connected."));
        } catch (IOException e) {
            removeEmitter(userId, emitter);
        }

        return emitter;
    }

    private void removeEmitter(Long userId, SseEmitter emitter) {
        List<SseEmitter> list = emitters.get(userId);
        if (list != null) {
            list.remove(emitter);
            if (list.isEmpty()) {
                emitters.remove(userId);
            }
        }
    }

    public static void pushAlert(Long userId, String message) {
        List<SseEmitter> userEmitters = emitters.get(userId);
        if (userEmitters != null && !userEmitters.isEmpty()) {
            List<SseEmitter> deadEmitters = new ArrayList<>();
            for (SseEmitter emitter : userEmitters) {
                try {
                    emitter.send(SseEmitter.event().name("NOTIFICATION").data(message));
                } catch (Exception e) {
                    deadEmitters.add(emitter);
                }
            }
            userEmitters.removeAll(deadEmitters);
        }
    }
}
