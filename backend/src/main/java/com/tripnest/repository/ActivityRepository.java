package com.tripnest.repository;

import com.tripnest.entity.Activity;
import com.tripnest.entity.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByItineraryOrderBySequenceOrderAscStartTimeAsc(Itinerary itinerary);
    long countByItinerary(Itinerary itinerary);
}
