package com.tripnest.repository;

import com.tripnest.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DestinationRepository extends JpaRepository<Destination, Long> {

    List<Destination> findByNameContainingIgnoreCaseOrCountryContainingIgnoreCase(
            String name, String country);

    List<Destination> findByPopularTrueOrderByRatingDesc();
}