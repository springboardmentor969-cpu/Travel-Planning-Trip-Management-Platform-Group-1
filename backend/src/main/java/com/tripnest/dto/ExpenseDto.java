package com.tripnest.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseDto(
        Long id,
        @NotBlank @Size(max = 80) String category,
        @NotNull @DecimalMin(value = "0.01") BigDecimal amount,
        @Size(max = 500) String description,
        @NotNull LocalDate expenseDate,
        Long tripId
) {
}
