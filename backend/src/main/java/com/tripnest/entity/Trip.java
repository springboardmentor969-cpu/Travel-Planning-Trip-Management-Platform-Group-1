package com.tripnest.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Trip Title
    @Column(nullable = false)
    private String title;

    // Destination
    @Column(nullable = false)
    private String destination;

    private LocalDate startDate;

    private LocalDate endDate;

    // Number of Travellers
    @Builder.Default
    private Integer travelers = 1;

    // Budget
    @Builder.Default
    private Double budget = 0.0;

    // Trip Status
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TripStatus status = TripStatus.PLANNING;

    // Trip Description
    @Column(length = 1000)
    private String description;

    // Traveller Names
    @ElementCollection
    @CollectionTable(
            name = "trip_travellers",
            joinColumns = @JoinColumn(name = "trip_id")
    )
    @Column(name = "traveller_name")
    @Builder.Default
    private List<String> travellerNames = new ArrayList<>();

    // Favourite Trip
    @Builder.Default
    private Boolean favourite = false;

    // Trip Owner
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    // Collaborators
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "trip_collaborators",
            joinColumns = @JoinColumn(name = "trip_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private List<User> collaborators = new ArrayList<>();

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}