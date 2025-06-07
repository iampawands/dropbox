package com.pawan.dropbox.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
public class FileController {

    // Upload a file
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        // TODO: Handle file upload
        return ResponseEntity.ok("File uploaded successfully.");
    }

    // List all uploaded files
    @GetMapping
    public ResponseEntity<?> listFiles() {
        // TODO: Return list of all files
        return ResponseEntity.ok("List of files.");
    }

    // Download a file
    @GetMapping("/{filename}")
    public ResponseEntity<?> downloadFile(@PathVariable String filename) {
        // TODO: Return file content
        return ResponseEntity.ok("File download triggered.");
    }
}

