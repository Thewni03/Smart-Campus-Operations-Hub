package com.SmartCampus.SmartCampus.Dto.Response;

import java.time.LocalDateTime;

public record AttachmentResponse(
        String id,
        String ticketId,
        String fileName,
        String fileUrl,
        String fileType,
        long fileSize,
        LocalDateTime uploadedAt
) {}
