package com.SmartCampus.SmartCampus.Entity;

import com.SmartCampus.SmartCampus.Entity.enums.Category;
import com.SmartCampus.SmartCampus.Entity.enums.Priority;
import com.SmartCampus.SmartCampus.Entity.enums.TicketStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    private String id;

    private String reportedBy;       // legacy alias for createdBy
    private String assignedTo;       // legacy alias for assignedTechnicianId
    private String resourceId;
    private String resourceName;
    private String createdBy;
    private String createdByName;
    private String assignedTechnicianId;
    private String assignedTechnicianName;

    private String title;
    private String description;
    private String location;

    private Category category;
    private Priority priority;
    private TicketStatus status;

    private String contactDetails;

    private String rejectionReason;
    private String resolutionNotes;

    @Builder.Default
    private List<String> attachmentIds = new ArrayList<>();  // max 3

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
