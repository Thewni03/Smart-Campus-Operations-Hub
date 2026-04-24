package com.SmartCampus.SmartCampus.Dto.Response;

import com.SmartCampus.SmartCampus.Entity.enums.Category;
import com.SmartCampus.SmartCampus.Entity.enums.Priority;
import com.SmartCampus.SmartCampus.Entity.enums.TicketStatus;

import java.time.LocalDateTime;

// Lightweight summary — used on GET /tickets (list view)
public record TicketSummaryResponse(
        String id,
        String title,
        String location,
        String resourceName,
        String description,
        String resolutionNotes,
        Category category,
        Priority priority,
        TicketStatus status,
        String reportedBy,
        String createdBy,
        String createdByName,
        String assignedTo,
        String assignedTechnicianId,
        String assignedTechnicianName,
        int attachmentCount,
        LocalDateTime createdAt
) {}
