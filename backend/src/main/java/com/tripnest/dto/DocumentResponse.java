package com.tripnest.dto;

import com.tripnest.entity.TripDocument;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {
    private Long id;
    private String fileName;
    private String fileType;
    private String fileUrl;
    private Long fileSize;
    private String name;
    private String type;
    private String url;
    private Long sizeBytes;
    private LocalDateTime uploadedAt;

    public static DocumentResponse from(TripDocument doc) {
        return DocumentResponse.builder()
                .id(doc.getId())
                .fileName(doc.getFileName())
                .fileType(doc.getFileType())
                .fileUrl(doc.getFileUrl())
                .fileSize(doc.getFileSize())
                .name(doc.getFileName())
                .type(doc.getFileType())
                .url(doc.getFileUrl())
                .sizeBytes(doc.getFileSize())
                .uploadedAt(doc.getUploadedAt())
                .build();
    }
}
