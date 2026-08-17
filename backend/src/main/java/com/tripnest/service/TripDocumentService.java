package com.tripnest.service;

import com.tripnest.dto.TripDocumentDto;
import com.tripnest.entity.Trip;
import com.tripnest.entity.TripDocument;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.repository.TripDocumentRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class TripDocumentService {
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;
    private static final Map<String, String> CONTENT_TYPES_BY_EXTENSION = Map.of(
            "pdf", "application/pdf",
            "jpg", "image/jpeg",
            "jpeg", "image/jpeg",
            "png", "image/png",
            "doc", "application/msword",
            "docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    private static final Set<String> ALLOWED_TYPES = Set.copyOf(CONTENT_TYPES_BY_EXTENSION.values());
    private final TripDocumentRepository documentRepository;
    private final TripService tripService;
    private final UserService userService;
    private final Path uploadDirectory;
    private final boolean uploadsEnabled;

    public TripDocumentService(TripDocumentRepository documentRepository, TripService tripService, UserService userService, @Value("${app.upload.directory:uploads}") String uploadDirectory, @Value("${app.upload.enabled:true}") boolean uploadsEnabled) {
        this.documentRepository = documentRepository;
        this.tripService = tripService;
        this.userService = userService;
        this.uploadDirectory = Path.of(uploadDirectory).toAbsolutePath().normalize();
        this.uploadsEnabled = uploadsEnabled;
    }

    @Transactional(readOnly = true)
    public List<TripDocumentDto> list(Long tripId) {
        tripService.findAccessibleEntity(tripId);
        return documentRepository.findByTripIdOrderByUploadedAtDesc(tripId).stream().map(this::toDto).toList();
    }

    public TripDocumentDto upload(Long tripId, MultipartFile file) {
        ensureUploadsEnabled();
        Trip trip = tripService.findEditableEntity(tripId);
        validate(file);
        String originalFilename = Path.of(file.getOriginalFilename()).getFileName().toString();
        String contentType = resolveContentType(file, originalFilename);
        String storageKey = UUID.randomUUID() + extension(originalFilename);
        try {
            Files.createDirectories(uploadDirectory);
            Files.copy(file.getInputStream(), uploadDirectory.resolve(storageKey), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new IllegalArgumentException("Could not store the uploaded file");
        }
        TripDocument document = new TripDocument();
        document.setTrip(trip);
        document.setUploadedBy(userService.getCurrentUser());
        document.setOriginalFilename(originalFilename);
        document.setStorageKey(storageKey);
        document.setContentType(contentType);
        document.setSize(file.getSize());
        return toDto(documentRepository.save(document));
    }

    @Transactional(readOnly = true)
    public DownloadedDocument download(Long tripId, Long documentId) {
        ensureUploadsEnabled();
        tripService.findAccessibleEntity(tripId);
        TripDocument document = find(tripId, documentId);
        Path path = uploadDirectory.resolve(document.getStorageKey()).normalize();
        if (!path.startsWith(uploadDirectory) || !Files.exists(path)) throw new ResourceNotFoundException("Document file not found");
        return new DownloadedDocument(new FileSystemResource(path), document.getOriginalFilename(), document.getContentType());
    }

    public void delete(Long tripId, Long documentId) {
        ensureUploadsEnabled();
        tripService.findEditableEntity(tripId);
        TripDocument document = find(tripId, documentId);
        try { Files.deleteIfExists(uploadDirectory.resolve(document.getStorageKey()).normalize()); }
        catch (IOException ex) { throw new IllegalArgumentException("Could not delete the document file"); }
        documentRepository.delete(document);
    }

    private TripDocument find(Long tripId, Long documentId) {
        return documentRepository.findByIdAndTripId(documentId, tripId).orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }
    private void ensureUploadsEnabled() {
        if (!uploadsEnabled) throw new IllegalStateException("Document uploads are unavailable in the hosted demo because free hosting does not provide persistent file storage");
    }
    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("Select a file to upload");
        if (file.getSize() > MAX_FILE_SIZE) throw new IllegalArgumentException("Documents must be 10 MB or smaller");
        if (file.getOriginalFilename() == null || file.getOriginalFilename().isBlank()) throw new IllegalArgumentException("File name is required");
        resolveContentType(file, file.getOriginalFilename());
    }
    private String extension(String filename) {
        int index = filename.lastIndexOf('.');
        return index >= 0 ? filename.substring(index) : "";
    }
    private String resolveContentType(MultipartFile file, String filename) {
        String extension = extension(filename).replaceFirst("^\\.", "").toLowerCase(Locale.ROOT);
        String expectedType = CONTENT_TYPES_BY_EXTENSION.get(extension);
        if (expectedType == null) throw new IllegalArgumentException("Only PDF, JPG, PNG, DOC, and DOCX files are allowed");
        String suppliedType = file.getContentType();
        if (suppliedType != null && !suppliedType.equals("application/octet-stream") && !ALLOWED_TYPES.contains(suppliedType)) {
            throw new IllegalArgumentException("The selected file type does not match its extension");
        }
        return expectedType;
    }
    private TripDocumentDto toDto(TripDocument document) {
        return new TripDocumentDto(document.getId(), document.getOriginalFilename(), document.getContentType(), document.getSize(), document.getUploadedAt(), document.getUploadedBy().getName());
    }
    public record DownloadedDocument(Resource resource, String filename, String contentType) { }
}
