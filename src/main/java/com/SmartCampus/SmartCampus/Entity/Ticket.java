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

    private String reportedBy;       // User ID from auth service (Member 4)
    private String assignedTo;       // Technician User ID (nullable)
    private String resourceId;       // Resource ID from Member 1 (nullable)

    private String title;
    private String description;
    private String location;         // freetext fallback if no resourceId

    private Category category;
    private Priority priority;
    private TicketStatus status;

    private String contactDetails;   // nullable

    private String rejectionReason;  // nullable — set when REJECTED
    private String resolutionNotes;  // nullable — set when RESOLVED/CLOSED

    @Builder.Default
    private List<String> attachmentIds = new ArrayList<>();  // max 3

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
