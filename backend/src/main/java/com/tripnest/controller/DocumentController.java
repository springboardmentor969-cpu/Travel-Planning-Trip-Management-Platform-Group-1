package com.tripnest.controller;

import com.tripnest.dto.ApiResponse;
import com.tripnest.dto.DocumentDTO;
import com.tripnest.entity.DocumentAttachment;
import com.tripnest.entity.User;
import com.tripnest.service.DocumentService;
import com.tripnest.service.UserService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DocumentController {

    private final DocumentService documentService;
    private final UserService userService;

    public DocumentController(DocumentService documentService, UserService userService) {
        this.documentService = documentService;
        this.userService = userService;
    }

    @PostMapping("/trips/{tripId}/documents")
    public ResponseEntity<ApiResponse<DocumentDTO>> uploadDocument(
            @PathVariable Long tripId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false) DocumentAttachment.DocumentCategory category,
            @RequestParam(value = "description", required = false) String description) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        DocumentDTO dto = documentService.uploadDocument(tripId, file, category, description, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Document uploaded successfully", dto));
    }

    @GetMapping("/trips/{tripId}/documents")
    public ResponseEntity<ApiResponse<List<DocumentDTO>>> getTripDocuments(@PathVariable Long tripId) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        List<DocumentDTO> list = documentService.getTripDocuments(tripId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Trip documents retrieved successfully", list));
    }

    @GetMapping("/documents/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        Resource resource = documentService.loadFile(id, currentUser);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable Long id) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        documentService.deleteDocument(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Document deleted successfully"));
    }
}
