package com.tripnest.repository;

import com.tripnest.entity.TripDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripDocumentRepository extends JpaRepository<TripDocument, Long> {
    List<TripDocument> findByTripIdOrderByUploadedAtDesc(Long tripId);
    List<TripDocument> findByTripIdAndFileTypeOrderByUploadedAtDesc(Long tripId, String fileType);
}
