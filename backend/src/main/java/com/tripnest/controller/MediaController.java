package com.tripnest.controller;

import com.tripnest.dto.DocumentResponse;
import com.tripnest.dto.PhotoResponse;
import com.tripnest.entity.TripDocument;
import com.tripnest.security.CustomUserPrincipal;
import com.tripnest.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    // GET /api/trips/:tripId/documents
    @GetMapping("/documents")
    public ResponseEntity<List<DocumentResponse>> getDocuments(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @RequestParam(required = false) String type
    ) {
        return ResponseEntity.ok(mediaService.getDocuments(principal.getId(), tripId, type));
    }

    // POST /api/trips/:tripId/documents
    @PostMapping("/documents")
    public ResponseEntity<DocumentResponse> uploadDocument(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", required = false) String type
    ) {
        DocumentResponse response = mediaService.uploadDocument(principal.getId(), tripId, file, type);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/trips/:tripId/documents/:documentId/download
    @GetMapping("/documents/{documentId}/download")
    public ResponseEntity<Resource> downloadDocument(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @PathVariable Long documentId
    ) {
        Resource resource = mediaService.downloadDocument(principal.getId(), tripId, documentId);
        TripDocument doc = mediaService.getDocumentEntity(principal.getId(), tripId, documentId);

        String contentType = "application/octet-stream";
        if (doc.getFileName().toLowerCase().endsWith(".pdf")) {
            contentType = "application/pdf";
        } else if (doc.getFileName().toLowerCase().endsWith(".png")) {
            contentType = "image/png";
        } else if (doc.getFileName().toLowerCase().endsWith(".jpg") || doc.getFileName().toLowerCase().endsWith(".jpeg")) {
            contentType = "image/jpeg";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
                .body(resource);
    }

    // DELETE /api/trips/:tripId/documents/:documentId
    @DeleteMapping("/documents/{documentId}")
    public ResponseEntity<Void> deleteDocument(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId,
            @PathVariable Long documentId
    ) {
        mediaService.deleteDocument(principal.getId(), tripId, documentId);
        return ResponseEntity.noContent().build();
    }

    // GET /api/trips/:tripId/photos
    @GetMapping("/photos")
    public ResponseEntity<List<PhotoResponse>> getPhotos(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable Long tripId
    ) {
        return ResponseEntity.ok(mediaService.getPhotos(principal.getId(), tripId));
    }
}
