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

    // Named explicitly to avoid Lombok/Jackson stripping the "is" prefix
    // (a plain "isFavorite" boolean field would otherwise serialize as "favorite").
    @JsonProperty("isFavorite")
    private boolean favorite;

    public static DestinationResponse from(Destination destination, boolean isFavorite) {
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
