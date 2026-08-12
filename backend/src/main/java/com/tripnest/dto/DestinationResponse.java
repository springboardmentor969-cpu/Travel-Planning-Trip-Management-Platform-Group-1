package com.tripnest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tripnest.entity.Destination;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DestinationResponse {

    private Long id;
    private String name;
    private String country;
    private String description;
    private String image;
    private String travelGuide;
    private String popularTag;
    private Double rating;

    @JsonProperty("isFavorite")
    private boolean favorite;

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

    public boolean isFavorite() { return favorite; }
    public void setFavorite(boolean favorite) { this.favorite = favorite; }

    public static DestinationResponseBuilder builder() {
        return new DestinationResponseBuilder();
    }

    public static class DestinationResponseBuilder {
        private Long id;
        private String name;
        private String country;
        private String description;
        private String image;
        private String travelGuide;
        private String popularTag;
        private Double rating;
        private boolean favorite;

        public DestinationResponseBuilder id(Long id) { this.id = id; return this; }
        public DestinationResponseBuilder name(String name) { this.name = name; return this; }
        public DestinationResponseBuilder country(String country) { this.country = country; return this; }
        public DestinationResponseBuilder description(String description) { this.description = description; return this; }
        public DestinationResponseBuilder image(String image) { this.image = image; return this; }
        public DestinationResponseBuilder travelGuide(String travelGuide) { this.travelGuide = travelGuide; return this; }
        public DestinationResponseBuilder popularTag(String popularTag) { this.popularTag = popularTag; return this; }
        public DestinationResponseBuilder rating(Double rating) { this.rating = rating; return this; }
        public DestinationResponseBuilder favorite(boolean favorite) { this.favorite = favorite; return this; }

        public DestinationResponse build() {
            DestinationResponse response = new DestinationResponse();
            response.setId(id);
            response.setName(name);
            response.setCountry(country);
            response.setDescription(description);
            response.setImage(image);
            response.setTravelGuide(travelGuide);
            response.setPopularTag(popularTag);
            response.setRating(rating);
            response.setFavorite(favorite);
            return response;
        }
    }

    public static DestinationResponse from(Destination destination, boolean isFavorite) {
        if (destination == null) return null;
        return DestinationResponse.builder()
                .id(destination.getId())
                .name(destination.getName())
                .country(destination.getCountry())
                .description(destination.getDescription())
                .image(destination.getImage())
                .travelGuide(destination.getTravelGuide())
                .popularTag(destination.getPopularTag())
                .rating(destination.getRating())
                .favorite(isFavorite)
                .build();
    }
}
