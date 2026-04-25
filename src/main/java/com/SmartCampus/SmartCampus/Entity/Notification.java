package com.SmartCampus.SmartCampus.Entity;

import com.SmartCampus.SmartCampus.Entity.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String message;
    private NotificationType type;
    private boolean read;
    private String ticketId;
    private String resourceId;
    private LocalDateTime createdAt;
}
