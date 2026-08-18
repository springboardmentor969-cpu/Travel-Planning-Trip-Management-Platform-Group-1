package com.tripnest.controller;

import com.tripnest.dto.ApiResponse;
import com.tripnest.dto.GroupMessageDTO;
import com.tripnest.entity.User;
import com.tripnest.service.GroupMessageService;
import com.tripnest.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips/{tripId}/discussions")
public class GroupMessageController {

    private final GroupMessageService groupMessageService;
    private final UserService userService;

    public GroupMessageController(GroupMessageService groupMessageService, UserService userService) {
        this.groupMessageService = groupMessageService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GroupMessageDTO>>> getMessages(@PathVariable Long tripId) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        List<GroupMessageDTO> messages = groupMessageService.getMessages(tripId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Discussions retrieved successfully", messages));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GroupMessageDTO>> postMessage(
            @PathVariable Long tripId,
            @RequestBody Map<String, String> request) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        String text = request.get("message");
        GroupMessageDTO saved = groupMessageService.postMessage(tripId, text, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Message posted successfully", saved));
    }
}
