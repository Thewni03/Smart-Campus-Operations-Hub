package com.SmartCampus.SmartCampus.Util;

import com.SmartCampus.SmartCampus.Exception.FileStorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Component
public class FileStorageUtil {

    private static final List<String> ALLOWED_TYPES = List.of(
            "image/jpeg", "image/png", "image/webp"
    );

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${server.port:8080}")
    private String serverPort;

    /**
     * Validates and saves an uploaded file.
     * Returns the public URL of the stored file.
     */
    public String storeFile(MultipartFile file) {
        validateFile(file);

        String originalName = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "file"
        );

        // Generate unique filename to avoid collisions
        String extension = getExtension(originalName);
        String uniqueFileName = UUID.randomUUID() + "." + extension;

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            Path targetLocation = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return accessible URL
            return "http://localhost:" + serverPort + "/uploads/" + uniqueFileName;

        } catch (IOException ex) {
            throw new FileStorageException(
                    "Failed to store file " + originalName + ". Please try again.", ex
            );
        }
    }

    /**
     * Deletes a file from the upload directory by its URL.
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) return;

        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        try {
            Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new FileStorageException("Failed to delete file: " + fileName, ex);
        }
    }

    // ── private helpers ──────────────────────────────────

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileStorageException("File must not be empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new FileStorageException(
                    "Invalid file type. Only JPEG, PNG and WEBP are allowed"
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileStorageException("File size exceeds maximum limit of 5MB");
        }
    }

    private String getExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex >= 0) ? filename.substring(dotIndex + 1).toLowerCase() : "jpg";
    }
}