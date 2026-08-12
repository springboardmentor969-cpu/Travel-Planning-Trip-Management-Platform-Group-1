package com.tripnest.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "attractions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String image;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    @JsonIgnore
    private Destination destination;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Destination getDestination() { return destination; }
    public void setDestination(Destination destination) { this.destination = destination; }

    public static AttractionBuilder builder() {
        return new AttractionBuilder();
    }

    public static class AttractionBuilder {
        private Long id;
        private String name;
        private String description;
        private String image;
        private Destination destination;

        public AttractionBuilder id(Long id) { this.id = id; return this; }
        public AttractionBuilder name(String name) { this.name = name; return this; }
        public AttractionBuilder description(String description) { this.description = description; return this; }
        public AttractionBuilder image(String image) { this.image = image; return this; }
        public AttractionBuilder destination(Destination destination) { this.destination = destination; return this; }

        public Attraction build() {
            Attraction a = new Attraction();
            a.setId(id);
            a.setName(name);
            a.setDescription(description);
            a.setImage(image);
            a.setDestination(destination);
            return a;
        }
    }
}