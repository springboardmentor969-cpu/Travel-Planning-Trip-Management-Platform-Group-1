package com.tripnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreferenceResponse {
    private Boolean emailNotifications;
    private Boolean pushNotifications;
    private Boolean tripReminders;
    private Boolean promotions;
}
