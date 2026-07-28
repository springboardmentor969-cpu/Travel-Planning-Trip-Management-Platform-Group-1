package com.tripnest.dto;

import com.tripnest.entity.TripStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TripDto(
        Long id,
        @NotBlank @Size(max = 140) String title,
        @NotBlank @Size(max = 140) String destination,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        @NotNull @DecimalMin(value = "0.0", inclusive = true) BigDecimal budget,
        @NotNull TripStatus status,
        Long userId,
        String userName
) {
}
