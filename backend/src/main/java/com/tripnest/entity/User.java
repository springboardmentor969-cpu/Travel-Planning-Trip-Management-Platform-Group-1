package com.tripnest.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    // Nullable so Google OAuth2 users (no local password) can also use this entity
    @Column
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.TRAVELER;

    // ---- Profile management fields (Module 1 / user profile) ----
    private String bio;
    private String favoriteDestination;
    private String phone;

    // ---- Password reset support ----
    private String resetToken;
    private LocalDateTime resetTokenExpiry;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
private List<Trip> ownedTrips = new ArrayList<>();

private boolean verified;

private String verificationToken;

private LocalDateTime verificationTokenExpiry;

}


