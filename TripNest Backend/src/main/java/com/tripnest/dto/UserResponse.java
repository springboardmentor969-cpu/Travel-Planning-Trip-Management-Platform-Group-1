package com.tripnest.dto;

import com.tripnest.entity.Role;
import com.tripnest.entity.User;
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private String travelPreferences;

    public UserResponse() {}

    public UserResponse(Long id, String name, String email, Role role, String travelPreferences) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.travelPreferences = travelPreferences;
    }

    public static UserResponseBuilder builder() {
        return new UserResponseBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getTravelPreferences() { return travelPreferences; }
    public void setTravelPreferences(String travelPreferences) { this.travelPreferences = travelPreferences; }

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .travelPreferences(user.getTravelPreferences())
                .build();
    }

    public static class UserResponseBuilder {
        private Long id;
        private String name;
        private String email;
        private Role role;
        private String travelPreferences;

        public UserResponseBuilder id(Long id) { this.id = id; return this; }
        public UserResponseBuilder name(String name) { this.name = name; return this; }
        public UserResponseBuilder email(String email) { this.email = email; return this; }
        public UserResponseBuilder role(Role role) { this.role = role; return this; }
        public UserResponseBuilder travelPreferences(String travelPreferences) { this.travelPreferences = travelPreferences; return this; }

        public UserResponse build() {
            return new UserResponse(id, name, email, role, travelPreferences);
        }
    }
}