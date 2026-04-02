package com.SmartCampus.SmartCampus.Entity;

import com.SmartCampus.SmartCampus.Entity.enums.BookingStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    private String id;

    private String resourceId;
    private String userId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private BookingStatus status;
    private String purpose;
    private String adminReason;
    
    private LocalDateTime createdAt;
}
