package com.tripnest.dto;

import com.tripnest.entity.Activity;
import com.tripnest.entity.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityResponse {

    private Long id;
    private String title;
    private ActivityType type;
    private String place;
    private String startTime;
    private String endTime;
    private String notes;
    private Boolean reminder;
    private Integer sortOrder;

    public static ActivityResponse from(Activity activity) {
        return ActivityResponse.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .type(activity.getType())
                .place(activity.getPlace())
                .startTime(activity.getStartTime())
                .endTime(activity.getEndTime())
                .notes(activity.getNotes())
                .reminder(activity.getReminder())
                .sortOrder(activity.getSortOrder())
                .build();
    }
}