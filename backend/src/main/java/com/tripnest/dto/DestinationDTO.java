package com.tripnest.dto;

public class DestinationDTO {
    private Long id;
    private String name;
    private String country;
    private String city;
    private String description;
    private String imageUrl;
    private String category;
    private String bestTimeToVisit;
    private Double avgDailyBudget;
    private Double latitude;
    private Double longitude;
    private Double rating;
    private boolean isPopular;
    private String topAttractions;

    public DestinationDTO() {}

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
}
