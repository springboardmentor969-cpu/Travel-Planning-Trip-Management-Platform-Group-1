package com.tripnest.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ShareTripRequest {
    @NotBlank
    @Email(message = "Enter a valid email address")
    private String email;
}
