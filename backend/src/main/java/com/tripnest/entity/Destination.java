package com.tripnest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "destinations", indexes = {
    @Index(name = "idx_destination_country", columnList = "country"),
    @Index(name = "idx_destination_category", columnList = "category")
})
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String country;

    @Column(length = 100)
    private String city;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 500)
    private String imageUrl;

    @Column(length = 50)
    private String category; // Beach, Mountain, Cultural, City, Adventure, Historical

    @Column(length = 100)
    private String bestTimeToVisit;

    private Double avgDailyBudget;

    private Double latitude;

    private Double longitude;

    private Double rating = 4.8;

    private boolean isPopular = false;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String topAttractions;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Destination() {}

    public Destination(String name, String country, String city, String description, String imageUrl,
                       String category, String bestTimeToVisit, Double avgDailyBudget,
                       Double latitude, Double longitude, Double rating, boolean isPopular, String topAttractions) {
        this.name = name;
        this.country = country;
        this.city = city;
        this.description = description;
        this.imageUrl = imageUrl;
        this.category = category;
        this.bestTimeToVisit = bestTimeToVisit;
        this.avgDailyBudget = avgDailyBudget;
        this.latitude = latitude;
        this.longitude = longitude;
        this.rating = rating;
        this.isPopular = isPopular;
        this.topAttractions = topAttractions;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBestTimeToVisit() { return bestTimeToVisit; }
    public void setBestTimeToVisit(String bestTimeToVisit) { this.bestTimeToVisit = bestTimeToVisit; }

    public Double getAvgDailyBudget() { return avgDailyBudget; }
    public void setAvgDailyBudget(Double avgDailyBudget) { this.avgDailyBudget = avgDailyBudget; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public boolean isPopular() { return isPopular; }
    public void setPopular(boolean popular) { isPopular = popular; }

    public String getTopAttractions() { return topAttractions; }
    public void setTopAttractions(String topAttractions) { this.topAttractions = topAttractions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
