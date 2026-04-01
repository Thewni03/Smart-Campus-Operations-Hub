package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Entity.Booking;
import com.SmartCampus.SmartCampus.Entity.enums.BookingStatus;
import com.SmartCampus.SmartCampus.Repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(Booking bookingRequest) {
        
        // Check for conflicts
        long conflicts = bookingRepository.countConflictingBookings(
                bookingRequest.getResourceId(),
                bookingRequest.getStartTime(),
                bookingRequest.getEndTime()
        );

        if (conflicts > 0) {
            throw new RuntimeException("This resource is already booked for this time slot.");
        }

        // Set default status to PENDING
        bookingRequest.setStatus(BookingStatus.PENDING);
        
        return bookingRepository.save(bookingRequest);
    }
}
