package com.tripnest.service;

import com.tripnest.dto.DocumentResponse;
import com.tripnest.dto.PhotoResponse;
import com.tripnest.entity.Trip;
import com.tripnest.entity.TripDocument;
import com.tripnest.exception.ApiException;
import com.tripnest.repository.TripDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final TripDocumentRepository documentRepository;
    private final TripAccessService tripAccessService;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final String UPLOAD_DIR = "uploads/documents/";

    public List<DocumentResponse> getDocuments(Long userId, Long tripId, String type) {
        tripAccessService.findAccessibleTrip(userId, tripId);
        List<TripDocument> docs = (type != null && !type.isBlank())
                ? documentRepository.findByTripIdAndFileTypeOrderByUploadedAtDesc(tripId, type)
                : documentRepository.findByTripIdOrderByUploadedAtDesc(tripId);

        return docs.stream().map(DocumentResponse::from).toList();
    }

    @Transactional
    public DocumentResponse uploadDocument(Long userId, Long tripId, MultipartFile file, String type) {
        Trip trip = tripAccessService.findAccessibleTrip(userId, tripId);

        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("File cannot be empty.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw ApiException.badRequest("File size exceeds maximum limit of 10MB.");
        }

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document";
        String extension = getFileExtension(originalFilename).toLowerCase();
        
        List<String> allowedExtensions = List.of("pdf", "jpg", "jpeg", "png", "doc", "docx", "txt");
        if (!allowedExtensions.contains(extension)) {
            throw ApiException.badRequest("Invalid file type. Allowed formats: PDF, JPG, PNG, DOC, TXT.");
        }

        String uniqueFileName = UUID.randomUUID() + "_" + originalFilename;
        java.nio.file.Path uploadPath = Paths.get(UPLOAD_DIR);

        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            try (InputStream inputStream = file.getInputStream()) {
                java.nio.file.Path filePath = uploadPath.resolve(uniqueFileName);
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw ApiException.badRequest("Failed to save file: " + e.getMessage());
        }

        String fileType = type != null ? type : getDocumentTypeFromExtension(extension);

        TripDocument doc = TripDocument.builder()
                .fileName(originalFilename)
                .fileType(fileType)
                .fileUrl(UPLOAD_DIR + uniqueFileName)
                .fileSize(file.getSize())
                .uploadedAt(LocalDateTime.now())
                .trip(trip)
                .build();

        documentRepository.save(doc);
        return DocumentResponse.from(doc);
    }

    public Resource downloadDocument(Long userId, Long tripId, Long documentId) {
        tripAccessService.findAccessibleTrip(userId, tripId);
        TripDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> ApiException.notFound("Document not found."));

        if (!doc.getTrip().getId().equals(tripId)) {
            throw ApiException.notFound("Document not found.");
        }

        try {
            java.nio.file.Path filePath = Paths.get(doc.getFileUrl());
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw ApiException.notFound("File not found on server storage.");
            }
        } catch (MalformedURLException e) {
            throw ApiException.notFound("File not found on server storage.");
        }
    }

    public TripDocument getDocumentEntity(Long userId, Long tripId, Long documentId) {
        tripAccessService.findAccessibleTrip(userId, tripId);
        TripDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> ApiException.notFound("Document not found."));

        if (!doc.getTrip().getId().equals(tripId)) {
            throw ApiException.notFound("Document not found.");
        }
        return doc;
    }

    @Transactional
    public void deleteDocument(Long userId, Long tripId, Long documentId) {
        tripAccessService.findAccessibleTrip(userId, tripId);
        TripDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> ApiException.notFound("Document not found."));

        if (!doc.getTrip().getId().equals(tripId)) {
            throw ApiException.notFound("Document not found.");
        }

        if (doc.getFileUrl() != null) {
            try {
                java.nio.file.Path filePath = Paths.get(doc.getFileUrl());
                Files.deleteIfExists(filePath);
            } catch (IOException ignored) {
            }
        }

        documentRepository.delete(doc);
    }

    public List<PhotoResponse> getPhotos(Long userId, Long tripId) {
        tripAccessService.findAccessibleTrip(userId, tripId);
        List<TripDocument> photos = documentRepository.findByTripIdAndFileTypeOrderByUploadedAtDesc(tripId, "PHOTO");
        if (photos.isEmpty()) {
            photos = documentRepository.findByTripIdAndFileTypeOrderByUploadedAtDesc(tripId, "image");
        }

        return photos.stream()
                .map(p -> PhotoResponse.builder()
                        .id(p.getId())
                        .fileName(p.getFileName())
                        .fileUrl(p.getFileUrl())
                        .caption(p.getFileName())
                        .uploadedAt(p.getUploadedAt())
                        .build())
                .toList();
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    private String getDocumentTypeFromExtension(String ext) {
        if (List.of("jpg", "jpeg", "png").contains(ext)) return "PHOTO";
        if (List.of("pdf").contains(ext)) return "TICKET";
        return "TRAVEL_DOCUMENT";
    }
}
