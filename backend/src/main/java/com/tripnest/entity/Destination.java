package com.tripnest.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "destinations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String country;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String image;

    @Column(columnDefinition = "TEXT")
    private String travelGuide;

    private String popularTag;

    private Double rating;

    @Builder.Default
    private Boolean popular = false;

    @Builder.Default
    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Attraction> attractions = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getTravelGuide() { return travelGuide; }
    public void setTravelGuide(String travelGuide) { this.travelGuide = travelGuide; }

    public String getPopularTag() { return popularTag; }
    public void setPopularTag(String popularTag) { this.popularTag = popularTag; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Boolean getPopular() { return popular; }
    public void setPopular(Boolean popular) { this.popular = popular; }

    public List<Attraction> getAttractions() { return attractions; }
    public void setAttractions(List<Attraction> attractions) { this.attractions = attractions; }

    public static DestinationBuilder builder() {
        return new DestinationBuilder();
    }

    public static class DestinationBuilder {
        private Long id;
        private String name;
        private String country;
        private String description;
        private String image;
        private String travelGuide;
        private String popularTag;
        private Double rating;
        private Boolean popular = false;
        private List<Attraction> attractions = new ArrayList<>();

        public DestinationBuilder id(Long id) { this.id = id; return this; }
        public DestinationBuilder name(String name) { this.name = name; return this; }
        public DestinationBuilder country(String country) { this.country = country; return this; }
        public DestinationBuilder description(String description) { this.description = description; return this; }
        public DestinationBuilder image(String image) { this.image = image; return this; }
        public DestinationBuilder travelGuide(String travelGuide) { this.travelGuide = travelGuide; return this; }
        public DestinationBuilder popularTag(String popularTag) { this.popularTag = popularTag; return this; }
        public DestinationBuilder rating(Double rating) { this.rating = rating; return this; }
        public DestinationBuilder popular(Boolean popular) { this.popular = popular; return this; }
        public DestinationBuilder attractions(List<Attraction> attractions) { this.attractions = attractions; return this; }

        public Destination build() {
            Destination d = new Destination();
            d.setId(id);
            d.setName(name);
            d.setCountry(country);
            d.setDescription(description);
            d.setImage(image);
            d.setTravelGuide(travelGuide);
            d.setPopularTag(popularTag);
            d.setRating(rating);
            d.setPopular(popular);
            d.setAttractions(attractions);
            return d;
        }
    }
}