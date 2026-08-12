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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public static AttractionResponseBuilder builder() {
        return new AttractionResponseBuilder();
    }

    public static class AttractionResponseBuilder {
        private Long id;
        private String name;
        private String description;
        private String image;

        public AttractionResponseBuilder id(Long id) { this.id = id; return this; }
        public AttractionResponseBuilder name(String name) { this.name = name; return this; }
        public AttractionResponseBuilder description(String description) { this.description = description; return this; }
        public AttractionResponseBuilder image(String image) { this.image = image; return this; }

        public AttractionResponse build() {
            AttractionResponse res = new AttractionResponse();
            res.setId(id);
            res.setName(name);
            res.setDescription(description);
            res.setImage(image);
            return res;
        }
    }

    public static AttractionResponse from(Attraction attraction) {
        if (attraction == null) return null;
        return AttractionResponse.builder()
                .id(attraction.getId())
                .name(attraction.getName())
                .description(attraction.getDescription())
                .image(attraction.getImage())
                .build();
    }
}