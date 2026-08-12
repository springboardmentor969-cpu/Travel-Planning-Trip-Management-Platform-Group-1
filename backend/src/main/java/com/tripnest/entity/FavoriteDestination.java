package com.tripnest.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "favorite_destinations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "destination_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteDestination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @Builder.Default
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Destination getDestination() { return destination; }
    public void setDestination(Destination destination) { this.destination = destination; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static FavoriteDestinationBuilder builder() {
        return new FavoriteDestinationBuilder();
    }

    public static class FavoriteDestinationBuilder {
        private Long id;
        private User user;
        private Destination destination;
        private Instant createdAt = Instant.now();

        public FavoriteDestinationBuilder id(Long id) { this.id = id; return this; }
        public FavoriteDestinationBuilder user(User user) { this.user = user; return this; }
        public FavoriteDestinationBuilder destination(Destination destination) { this.destination = destination; return this; }
        public FavoriteDestinationBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public FavoriteDestination build() {
            FavoriteDestination fd = new FavoriteDestination();
            fd.setId(id);
            fd.setUser(user);
            fd.setDestination(destination);
            fd.setCreatedAt(createdAt);
            return fd;
        }
    }
}