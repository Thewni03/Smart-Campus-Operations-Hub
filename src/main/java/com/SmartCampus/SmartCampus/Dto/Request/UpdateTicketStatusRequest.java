package com.SmartCampus.SmartCampus.Dto.Request;

import com.SmartCampus.SmartCampus.Entity.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateTicketStatusRequest {

    @NotNull(message = "Status is required")
    private TicketStatus status;

    // Required when status = REJECTED
    private String rejectionReason;

    // Required when status = RESOLVED or CLOSED
    private String resolutionNotes;

    // Admin/technician can assign a technician while updating status
    private String assignedTo;
}
