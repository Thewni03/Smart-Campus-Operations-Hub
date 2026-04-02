package com.SmartCampus.SmartCampus.Dto.Response;

import java.time.LocalDateTime;

public record CommentResponse(
        String id,
        String ticketId,
        String authorId,
        String authorName,
        String authorRole,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
