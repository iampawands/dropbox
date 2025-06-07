package com.pawan.dropbox.service;

import com.pawan.dropbox.config.FileStoreProperties;
import com.pawan.dropbox.entity.FileMetadata;
import com.pawan.dropbox.exception.FileStorageException;
import com.pawan.dropbox.repository.FileMetadataRepository;
import com.pawan.dropbox.util.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@Service
public class FileService {

    Logger logger = LoggerFactory.getLogger(FileService.class);

    private final FileStoreProperties fileStoreProperties;
    private final FileMetadataRepository fileMetadataRepository;

    public FileService(FileStoreProperties fileStoreProperties,
                       FileMetadataRepository fileMetadataRepository){
        this.fileStoreProperties = fileStoreProperties;
        this.fileMetadataRepository = fileMetadataRepository;
    }

    public void uploadFile(MultipartFile file) {
        FileUtils.validateFile(file, fileStoreProperties.getAllowedExtensions());

        try {
            Path uploadPath = Paths.get(fileStoreProperties.getUploadDir());
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path targetPath = uploadPath.resolve(file.getOriginalFilename());
            file.transferTo(targetPath.toFile());

            fileMetadataRepository.save(FileMetadata.builder()
                            .name(file.getOriginalFilename())
                            .contentType(file.getContentType())
                            .path(targetPath.toString())
                            .size(file.getSize())
                            .uploadedAt(LocalDateTime.now())
                    .build());
        } catch (IOException e) {
            logger.info("Exception occurred inside uploadFile method of fileService: {}", e.getMessage(), e);
            throw new FileStorageException("Could not save file: " + e.getMessage());
        }
    }

    public Page<FileMetadata> listFilesWithFilter(Pageable paging){
        Page<FileMetadata> fileMetadataViews = null;
        fileMetadataViews = fileMetadataRepository.findAll(paging);
        return  fileMetadataViews;
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf('.') + 1);
    }

    public FileMetadata getFileMetadataById(Long fileId) {
        return fileMetadataRepository.findById(fileId).orElse(null);
    }

    public byte[] loadFileData(Long fileId) throws IOException {
        FileMetadata metadata = getFileMetadataById(fileId);
        if (metadata == null) {
            logger.info("File metadata not found for id: " + fileId);
            throw new FileNotFoundException("File metadata not found for id: " + fileId);
        }

        Path path = Paths.get(metadata.getPath());
        if (!Files.exists(path)) {
            logger.info("File not found at path: " + metadata.getPath());
            throw new FileNotFoundException("File not found at path: " + metadata.getPath());
        }

        return Files.readAllBytes(path);
    }
}
