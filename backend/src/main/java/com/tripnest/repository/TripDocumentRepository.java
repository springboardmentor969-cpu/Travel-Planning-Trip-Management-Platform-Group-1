package com.tripnest.repository;

import com.tripnest.entity.TripDocument;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripDocumentRepository extends JpaRepository<TripDocument, Long> {
    List<TripDocument> findByTripIdOrderByUploadedAtDesc(Long tripId);
    Optional<TripDocument> findByIdAndTripId(Long id, Long tripId);
}
