package com.SmartCampus.SmartCampus.Dto.Response;

import com.SmartCampus.SmartCampus.Entity.enums.Category;
import com.SmartCampus.SmartCampus.Entity.enums.Priority;
import com.SmartCampus.SmartCampus.Entity.enums.TicketStatus;

import java.time.LocalDateTime;

// Lightweight summary — used on GET /tickets (list view)
public record TicketSummaryResponse(
        String id,
        String title,
        Category category,
        Priority priority,
        TicketStatus status,
        String reportedBy,
        String assignedTo,
        int attachmentCount,
        LocalDateTime createdAt
) {}
