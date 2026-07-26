package com.tripnest.dto;

import com.tripnest.entity.Attraction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttractionResponse {

    private Long id;
    private String name;
    private String description;
    private String image;

    public static AttractionResponse from(Attraction attraction) {
        return AttractionResponse.builder()
                .id(attraction.getId())
                .name(attraction.getName())
                .description(attraction.getDescription())
                .image(attraction.getImage())
                .build();
    }
}