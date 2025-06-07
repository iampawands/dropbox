package com.pawan.dropbox.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@Tag(name = "File Operations")
public class FileController {

    @PostMapping("/upload")
    @Operation(description = "Upload a file")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        // TODO: Handle file upload
        return ResponseEntity.ok("File uploaded successfully.");
    }

    @GetMapping
    @Operation(description = "List All Files")
    public ResponseEntity<?> listFiles() {
        // TODO: Return list of all files
        return ResponseEntity.ok("List of files.");
    }

    @GetMapping("/{fileId}")
    @Operation(description = "Download file by Id")
    public ResponseEntity<?> downloadFile(@RequestParam String fileId) {
        // TODO: Return file content
        return ResponseEntity.ok("File download triggered.");
    }
}

