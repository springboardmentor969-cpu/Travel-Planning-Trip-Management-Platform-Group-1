package com.tripnest.dto;


import com.fasterxml.jackson.annotation.JsonFormat; // ADD THIS
import com.tripnest.entity.TripStatus;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TripDto(
        Long id,
        @NotBlank @Size(max = 140) String title,
        @NotBlank @Size(max = 140) String destination,
        @NotNull @JsonFormat(pattern = "yyyy-MM-dd") LocalDate startDate, // ADD @JsonFormat
        @NotNull @JsonFormat(pattern = "yyyy-MM-dd") LocalDate endDate,   // ADD @JsonFormat
        @NotNull @DecimalMin(value = "0.0", inclusive = true) BigDecimal budget,
        @NotNull @Min(1) Integer travelers,
        @NotNull TripStatus status,
        @NotNull Long userId,
        String userName
) {
}
