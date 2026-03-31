package com.SmartCampus.SmartCampus.Dto.Response;

import com.SmartCampus.SmartCampus.Entity.enums.Category;
import com.SmartCampus.SmartCampus.Entity.enums.Priority;
import com.SmartCampus.SmartCampus.Entity.enums.TicketStatus;


import java.time.LocalDateTime;
import java.util.List;
// Full ticket detail — used on GET /tickets/{id}
public record TicketResponse(
        String id,
        String title,
        String description,
        String location,
        Category category,
        Priority priority,
        TicketStatus status,
        String reportedBy,
        String assignedTo,
        String resourceId,
        String contactDetails,
        String rejectionReason,
        String resolutionNotes,
        List<AttachmentResponse> attachments,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
