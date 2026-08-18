package com.tripnest.repository;

import com.tripnest.entity.DocumentAttachment;
import com.tripnest.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentAttachment, Long> {
    List<DocumentAttachment> findByTripOrderByUploadedAtDesc(Trip trip);
    List<DocumentAttachment> findByTripAndCategory(Trip trip, DocumentAttachment.DocumentCategory category);
}
