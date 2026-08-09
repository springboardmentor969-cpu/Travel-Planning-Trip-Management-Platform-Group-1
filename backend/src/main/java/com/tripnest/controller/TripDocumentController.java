package com.tripnest.controller;

import com.tripnest.dto.TripDocumentDto;
import com.tripnest.service.TripDocumentService;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/trips/{tripId}/documents")
public class TripDocumentController {
    private final TripDocumentService documentService;
    public TripDocumentController(TripDocumentService documentService) { this.documentService = documentService; }
    @GetMapping public List<TripDocumentDto> list(@PathVariable Long tripId) { return documentService.list(tripId); }
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE) public ResponseEntity<TripDocumentDto> upload(@PathVariable Long tripId, @RequestParam("file") MultipartFile file) { return ResponseEntity.status(201).body(documentService.upload(tripId, file)); }
    @GetMapping("/{documentId}/download") public ResponseEntity<Resource> download(@PathVariable Long tripId, @PathVariable Long documentId) {
        TripDocumentService.DownloadedDocument document = documentService.download(tripId, documentId);
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(document.contentType())).header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(document.filename()).build().toString()).body(document.resource());
    }
    @DeleteMapping("/{documentId}") public ResponseEntity<Void> delete(@PathVariable Long tripId, @PathVariable Long documentId) { documentService.delete(tripId, documentId); return ResponseEntity.noContent().build(); }
}
