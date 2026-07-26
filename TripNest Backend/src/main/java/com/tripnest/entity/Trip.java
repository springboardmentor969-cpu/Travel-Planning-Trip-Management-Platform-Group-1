package com.tripnest.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private Double budget;

    private Integer travelerCount = 1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TripStatus status;

    private String coverImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    private Instant createdAt = Instant.now();

    public Trip() {}

    public Trip(Long id, String destination, LocalDate startDate, LocalDate endDate, Double budget, Integer travelerCount, TripStatus status, String coverImage, User owner, Instant createdAt) {
        this.id = id;
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.budget = budget;
        this.travelerCount = travelerCount != null ? travelerCount : 1;
        this.status = status;
        this.coverImage = coverImage;
        this.owner = owner;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public static TripBuilder builder() {
        return new TripBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }

    public Integer getTravelerCount() { return travelerCount; }
    public void setTravelerCount(Integer travelerCount) { this.travelerCount = travelerCount; }

    public TripStatus getStatus() { return status; }
    public void setStatus(TripStatus status) { this.status = status; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static class TripBuilder {
        private Long id;
        private String destination;
        private LocalDate startDate;
        private LocalDate endDate;
        private Double budget;
        private Integer travelerCount = 1;
        private TripStatus status;
        private String coverImage;
        private User owner;
        private Instant createdAt = Instant.now();

        public TripBuilder id(Long id) { this.id = id; return this; }
        public TripBuilder destination(String destination) { this.destination = destination; return this; }
        public TripBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public TripBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public TripBuilder budget(Double budget) { this.budget = budget; return this; }
        public TripBuilder travelerCount(Integer travelerCount) { if (travelerCount != null) this.travelerCount = travelerCount; return this; }
        public TripBuilder status(TripStatus status) { this.status = status; return this; }
        public TripBuilder coverImage(String coverImage) { this.coverImage = coverImage; return this; }
        public TripBuilder owner(User owner) { this.owner = owner; return this; }
        public TripBuilder createdAt(Instant createdAt) { if (createdAt != null) this.createdAt = createdAt; return this; }

        public Trip build() {
            return new Trip(id, destination, startDate, endDate, budget, travelerCount, status, coverImage, owner, createdAt);
        }
    }
}