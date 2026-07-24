package com.tripnest.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String bio;
    private String favoriteDestination;
    private String phone;
}
