package com.SmartCampus.SmartCampus.Entity;

import com.SmartCampus.SmartCampus.Entity.enums.BookingStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;
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

    @org.springframework.data.annotation.Transient
    private String userName;

    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private Integer expectedAttendees;

    private BookingStatus status;
    private String purpose;
    private String rejectionReason;
    private String reviewedBy;
    
    private LocalDateTime createdAt;
}
