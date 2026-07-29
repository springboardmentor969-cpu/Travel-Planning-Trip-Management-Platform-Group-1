package com.tripnest.repository;

import com.tripnest.entity.Itinerary;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {
    List<Itinerary> findByTripIdOrderByDayNumberAscIdAsc(Long tripId);
}
