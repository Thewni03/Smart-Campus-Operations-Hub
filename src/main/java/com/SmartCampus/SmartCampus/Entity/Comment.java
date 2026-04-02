package com.SmartCampus.SmartCampus.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;


@Document(collection = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    private String id;

    private String ticketId;     // references Ticket._id
    private String authorId;     // references User._id (from auth service)
    private String authorName;   // stored for display (denormalized)
    private String authorRole;   // USER | ADMIN | TECHNICIAN

    private String content;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;  // nullable — set only when edited
}
