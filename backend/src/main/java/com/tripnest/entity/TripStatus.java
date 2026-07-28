package com.tripnest.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.Locale;

public enum TripStatus {
    PLANNED,
    ACTIVE,
    COMPLETED,
    CANCELLED;

    @JsonCreator
    public static TripStatus fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return valueOf(value.trim().replace(' ', '_').toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Status must be Planned, Active, Completed, or Cancelled");
        }
    }
}
