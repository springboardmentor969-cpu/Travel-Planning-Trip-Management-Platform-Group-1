package com.tripnest.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider provider = AuthProvider.LOCAL;

    @Column(columnDefinition = "TEXT")
    private String travelPreferences;

    private Instant createdAt = Instant.now();

    public User() {}

    public User(Long id, String name, String email, String password, Role role, AuthProvider provider, String travelPreferences, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.provider = provider != null ? provider : AuthProvider.LOCAL;
        this.travelPreferences = travelPreferences;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public AuthProvider getProvider() { return provider; }
    public void setProvider(AuthProvider provider) { this.provider = provider; }

    public String getTravelPreferences() { return travelPreferences; }
    public void setTravelPreferences(String travelPreferences) { this.travelPreferences = travelPreferences; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static class UserBuilder {
        private Long id;
        private String name;
        private String email;
        private String password;
        private Role role;
        private AuthProvider provider = AuthProvider.LOCAL;
        private String travelPreferences;
        private Instant createdAt = Instant.now();

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder role(Role role) { this.role = role; return this; }
        public UserBuilder provider(AuthProvider provider) { if (provider != null) this.provider = provider; return this; }
        public UserBuilder travelPreferences(String travelPreferences) { this.travelPreferences = travelPreferences; return this; }
        public UserBuilder createdAt(Instant createdAt) { if (createdAt != null) this.createdAt = createdAt; return this; }

        public User build() {
            return new User(id, name, email, password, role, provider, travelPreferences, createdAt);
        }
    }
}