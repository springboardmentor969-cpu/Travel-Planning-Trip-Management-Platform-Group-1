package com.tripnest.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum TripStatus {
    PLANNED,
    ACTIVE,
    COMPLETED,
    CANCELLED;

    // This lets frontend send "planned" and we convert to PLANNED
    @JsonCreator
    public static TripStatus from(String value) {
        return TripStatus.valueOf(value.toUpperCase());
    }
}