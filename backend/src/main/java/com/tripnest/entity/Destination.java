package com.tripnest.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "destinations")
public class Destination {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100) private String name;
    @Column(nullable = false, length = 100) private String country;
    @Column(nullable = false, length = 60) private String region;
    @Column(length = 500) private String summary;
    @Column(length = 160) private String bestTime;
    @Column(length = 80) private String recommendedDays;
    @Column(length = 80) private String budgetRange;
    @Column(length = 800) private String attractions;
    @Column(length = 30) private String color = "ocean";

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getBestTime() { return bestTime; }
    public void setBestTime(String bestTime) { this.bestTime = bestTime; }
    public String getRecommendedDays() { return recommendedDays; }
    public void setRecommendedDays(String recommendedDays) { this.recommendedDays = recommendedDays; }
    public String getBudgetRange() { return budgetRange; }
    public void setBudgetRange(String budgetRange) { this.budgetRange = budgetRange; }
    public String getAttractions() { return attractions; }
    public void setAttractions(String attractions) { this.attractions = attractions; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
