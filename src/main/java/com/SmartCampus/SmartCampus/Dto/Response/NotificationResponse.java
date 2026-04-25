package com.SmartCampus.SmartCampus.Dto.Response;

import com.SmartCampus.SmartCampus.Entity.enums.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(
        String id,
        String message,
        NotificationType type,
        boolean read,
        String ticketId,
        String resourceId,
        LocalDateTime createdAt
) {
}
