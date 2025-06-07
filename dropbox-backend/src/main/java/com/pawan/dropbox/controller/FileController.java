package com.pawan.dropbox.controller;

import com.pawan.dropbox.entity.FileMetadata;
import com.pawan.dropbox.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
@Tag(name = "File Operations")
public class FileController {

    Logger logger = LoggerFactory.getLogger(FileController.class);

    private final FileService fileService;

    public FileController(FileService fileStorageService) {
        this.fileService = fileStorageService;
    }

    @PostMapping("/upload")
    @Operation(description = "Upload a file")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        logger.info("Inside uploadFile with fileName: {} fileType: {}", file.getName(), file.getContentType());
        fileService.uploadFile(file);
        return ResponseEntity.ok("File uploaded successfully.");
    }

    @GetMapping
    @Operation(description = "List All Files")
    public ResponseEntity<Page<FileMetadata>> listFilesWithFilter(@RequestParam(defaultValue = "0") int page,
                                                                  @RequestParam(defaultValue = "10") int size) {
        logger.info("Inside listFilesWithFilter with page: {} size: {}", page, size);
        return ResponseEntity.ok(fileService.listFilesWithFilter(PageRequest.of(page, size)));
    }

    @GetMapping("/{fileId}")
    @Operation(description = "Download file by Id")
    public ResponseEntity<?> downloadFile(@PathVariable Long fileId) {
        logger.info("Inside downloadFile with fileId: {}", fileId);
        FileMetadata fileMetadata = fileService.getFileMetadataById(fileId);
        if (fileMetadata == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] fileData;
        try {
            fileData = fileService.loadFileData(fileId);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error reading file content: " + e.getMessage());
        }

        String contentType = fileMetadata.getContentType();
        String filename = fileMetadata.getName();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .header(HttpHeaders.PRAGMA, "no-cache")
                .header(HttpHeaders.EXPIRES, "0")
                .body(fileData);
    }
}

