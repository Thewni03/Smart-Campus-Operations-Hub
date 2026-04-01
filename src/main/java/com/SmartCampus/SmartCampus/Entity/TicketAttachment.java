package com.SmartCampus.SmartCampus.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "ticket_attachments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketAttachment {

    @Id
    private String id;

    private String ticketId;       // references Ticket._id
    private String uploadedBy;     // User ID who uploaded

    private String fileUrl;        // path or URL to stored file
    private String fileName;       // original filename shown in UI (nullable)
    private String fileType;       // image/jpeg, image/png, image/webp
    private Long fileSize;         // bytes

    private LocalDateTime uploadedAt;
}
