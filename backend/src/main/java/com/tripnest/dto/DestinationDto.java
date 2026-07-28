package com.tripnest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record DestinationDto(
        Long id,
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Size(max = 100) String country,
        @NotBlank @Size(max = 60) String region,
        @Size(max = 500) String summary,
        @Size(max = 160) String bestTime,
        @Size(max = 80) String recommendedDays,
        @Size(max = 80) String budgetRange,
        List<String> attractions,
        String color
) { }
