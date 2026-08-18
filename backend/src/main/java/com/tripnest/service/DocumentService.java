package com.tripnest.service;

import com.tripnest.dto.DocumentDTO;
import com.tripnest.entity.DocumentAttachment;
import com.tripnest.entity.Trip;
import com.tripnest.entity.User;
import com.tripnest.exception.BadRequestException;
import com.tripnest.exception.ForbiddenException;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.repository.DocumentRepository;
import com.tripnest.repository.TripRepository;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final TripRepository tripRepository;
    private final StorageService storageService;
    private final TripService tripService;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "pdf", "png", "jpg", "jpeg", "webp", "doc", "docx", "txt"
    );

    public DocumentService(DocumentRepository documentRepository,
                           TripRepository tripRepository,
                           StorageService storageService,
                           TripService tripService) {
        this.documentRepository = documentRepository;
        this.tripRepository = tripRepository;
        this.storageService = storageService;
        this.tripService = tripService;
    }

    @Transactional
    public DocumentDTO uploadDocument(Long tripId, MultipartFile file, DocumentAttachment.DocumentCategory category,
                                      String description, User user) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        if (!tripService.isUserAuthorizedForTrip(trip, user)) {
            throw new ForbiddenException("Not authorized to upload files to this trip");
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null || !originalName.contains(".")) {
            throw new BadRequestException("Invalid file format");
        }

        String extension = originalName.substring(originalName.lastIndexOf('.') + 1).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Unsupported file type: ." + extension + ". Allowed: PDF, JPG, PNG, WEBP, DOC, DOCX, TXT");
        }

        String storedFileName = storageService.store(file);
        String fileUrl = "/uploads/" + storedFileName;

        DocumentAttachment attachment = new DocumentAttachment();
        attachment.setTrip(trip);
        attachment.setUploadedBy(user);
        attachment.setFileName(storedFileName);
        attachment.setOriginalFileName(originalName);
        attachment.setContentType(file.getContentType());
        attachment.setFileSize(file.getSize());
        attachment.setFileUrl(fileUrl);
        attachment.setCategory(category != null ? category : DocumentAttachment.DocumentCategory.OTHER);
        attachment.setDescription(description);

        DocumentAttachment saved = documentRepository.save(attachment);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<DocumentDTO> getTripDocuments(Long tripId, User user) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        if (!tripService.isUserAuthorizedForTrip(trip, user)) {
            throw new ForbiddenException("Not authorized to view documents for this trip");
        }

        return documentRepository.findByTripOrderByUploadedAtDesc(trip).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Resource loadFile(Long documentId, User user) {
        DocumentAttachment attachment = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "id", documentId));

        if (!tripService.isUserAuthorizedForTrip(attachment.getTrip(), user)) {
            throw new ForbiddenException("Not authorized to download this document");
        }

        return storageService.loadAsResource(attachment.getFileName());
    }

    @Transactional
    public void deleteDocument(Long documentId, User user) {
        DocumentAttachment attachment = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "id", documentId));

        if (!tripService.isGroupAdmin(attachment.getTrip(), user) &&
                (attachment.getUploadedBy() == null || !attachment.getUploadedBy().getId().equals(user.getId()))) {
            throw new ForbiddenException("Not authorized to delete this document");
        }

        storageService.delete(attachment.getFileName());
        documentRepository.delete(attachment);
    }

    public DocumentDTO mapToDTO(DocumentAttachment d) {
        DocumentDTO dto = new DocumentDTO();
        dto.setId(d.getId());
        dto.setTripId(d.getTrip().getId());
        if (d.getUploadedBy() != null) {
            dto.setUploadedById(d.getUploadedBy().getId());
            dto.setUploadedByName(d.getUploadedBy().getFullName());
        }
        dto.setFileName(d.getFileName());
        dto.setOriginalFileName(d.getOriginalFileName());
        dto.setContentType(d.getContentType());
        dto.setFileSize(d.getFileSize());
        dto.setFileUrl(d.getFileUrl());
        dto.setCategory(d.getCategory());
        dto.setDescription(d.getDescription());
        dto.setUploadedAt(d.getUploadedAt());
        return dto;
    }
}
