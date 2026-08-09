package com.tripnest.dto;

import java.time.Instant;

public record TripDocumentDto(Long id, String filename, String contentType, Long size, Instant uploadedAt, String uploadedBy) {
}
