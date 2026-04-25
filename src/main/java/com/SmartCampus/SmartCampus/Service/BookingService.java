package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Entity.Booking;
import com.SmartCampus.SmartCampus.Entity.enums.BookingStatus;
import com.SmartCampus.SmartCampus.Entity.UserAccount;
import com.SmartCampus.SmartCampus.Entity.enums.NotificationType;
import com.SmartCampus.SmartCampus.Repository.BookingRepository;
import com.SmartCampus.SmartCampus.Repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserAccountRepository userAccountRepository;

    public Booking createBooking(Booking bookingRequest) {
        
        long conflicts = bookingRepository.countConflictingBookings(
                bookingRequest.getResourceId(),
                bookingRequest.getBookingDate(),
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
        java.util.List<Booking> bookings = bookingRepository.findAll();
        enrichWithUserNames(bookings);
        return bookings;
    }

    public java.util.List<Booking> getBookingsByUser(String userId) {
        java.util.List<Booking> bookings = bookingRepository.findByUserId(userId);
        enrichWithUserNames(bookings);
        return bookings;
    }

    private void enrichWithUserNames(java.util.List<Booking> bookings) {
        for (Booking booking : bookings) {
            if (booking.getUserId() != null) {
                userAccountRepository.findById(booking.getUserId())
                        .ifPresent(user -> booking.setUserName(user.getFullName()));
            }
        }
    }

    public Booking updateStatus(String id, BookingStatus status, String rejectionReason, String reviewedBy) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found."));
        booking.setStatus(status);
        if (rejectionReason != null && !rejectionReason.isEmpty()) {
            booking.setRejectionReason(rejectionReason);
        }
        if (reviewedBy != null && !reviewedBy.isEmpty()) {
            booking.setReviewedBy(reviewedBy);
        }
        Booking savedBooking = bookingRepository.save(booking);

        if (status == BookingStatus.APPROVED) {
            notificationService.createNotification(
                    savedBooking.getUserId(),
                    "Your booking for " + savedBooking.getResourceId() + " has been approved.",
                    NotificationType.BOOKING_APPROVED,
                    null
            );
        } else if (status == BookingStatus.REJECTED) {
            notificationService.createNotification(
                    savedBooking.getUserId(),
                    "Your booking for " + savedBooking.getResourceId() + " has been rejected. Reason: " + rejectionReason,
                    NotificationType.BOOKING_REJECTED,
                    null
            );
        }

        return savedBooking;
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
