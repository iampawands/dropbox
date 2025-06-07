package com.pawan.dropbox.util;

import com.pawan.dropbox.exception.FileStorageException;
import com.pawan.dropbox.exception.FileTypeNotAllowedException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class FileUtils {
    public static void validateFile(MultipartFile file, List<String> allowedExtensions) {

        if (file == null || file.isEmpty()) {
            throw new FileStorageException("File is empty or null.");
        }
        String filename = file.getOriginalFilename();
        String extension = getExtension(filename);

        if (!allowedExtensions.contains(extension.toLowerCase())) {
            throw new FileTypeNotAllowedException("Unsupported file type: ." + extension);
        }
    }

    public static String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1);
    }
}
