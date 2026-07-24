package com.tripnest.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    // Which day of the trip this falls on: 1 = first day, 2 = second day, etc.
    @Column(nullable = false)
    private Integer dayNumber;

    private LocalTime time;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ActivityType type = ActivityType.SIGHTSEEING;

    // Place management - where this activity happens
    private String location;

    @Column(length = 1000)
    private String notes;

    // Activity reminders - how long before the activity to notify the traveler
    private Integer reminderMinutesBefore;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
