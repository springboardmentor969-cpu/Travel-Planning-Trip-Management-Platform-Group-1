package com.tripnest.dto;

import com.tripnest.entity.DiscussionMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscussionMessageResponse {
    private Long id;
    private String message;
    private String senderName;
    private String senderEmail;
    private LocalDateTime createdAt;

    public static DiscussionMessageResponse from(DiscussionMessage message) {
        return DiscussionMessageResponse.builder()
                .id(message.getId())
                .message(message.getMessage())
                .senderName(message.getSender() != null ? message.getSender().getName() : "Unknown")
                .senderEmail(message.getSender() != null ? message.getSender().getEmail() : "")
                .createdAt(message.getCreatedAt())
                .build();
    }
}
