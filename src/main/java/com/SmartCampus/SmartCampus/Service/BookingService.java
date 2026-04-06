package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Entity.Booking;
import com.SmartCampus.SmartCampus.Entity.enums.BookingStatus;
import com.SmartCampus.SmartCampus.Repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(Booking bookingRequest) {
        
        long conflicts = bookingRepository.countConflictingBookings(
                bookingRequest.getResourceId(),
                bookingRequest.getStartTime(),
                bookingRequest.getEndTime()
        );

        if (conflicts > 0) {
            throw new RuntimeException("This resource is already booked for this time slot.");
        }

        bookingRequest.setStatus(BookingStatus.PENDING);
        bookingRequest.setCreatedAt(LocalDateTime.now());
        
        return bookingRepository.save(bookingRequest);
    }

    public java.util.List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public java.util.List<Booking> getBookingsByUser(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking updateStatus(String id, BookingStatus status, String adminReason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found."));
        booking.setStatus(status);
        if (adminReason != null && !adminReason.isEmpty()) {
            booking.setAdminReason(adminReason);
        }
        return bookingRepository.save(booking);
    }

    public void deleteBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found."));
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Can only delete PENDING bookings.");
        }
        bookingRepository.deleteById(id);
    }
}
