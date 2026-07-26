package com.tripnest.dto;

public class UpdateProfileRequest {
    private String name;
    private String email;
    private String travelPreferences;

    public UpdateProfileRequest() {}

    public UpdateProfileRequest(String name, String email, String travelPreferences) {
        this.name = name;
        this.email = email;
        this.travelPreferences = travelPreferences;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTravelPreferences() {
        return travelPreferences;
    }

    public void setTravelPreferences(String travelPreferences) {
        this.travelPreferences = travelPreferences;
    }
}
