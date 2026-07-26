package com.tripnest.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FavoriteRequest {

    @NotNull(message = "Destination is required")
    private Long destinationId;
}