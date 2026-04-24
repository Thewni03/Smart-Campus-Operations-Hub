package com.SmartCampus.SmartCampus.Controller;

import com.SmartCampus.SmartCampus.Dto.Response.ApiResponse;
import com.SmartCampus.SmartCampus.Entity.Booking;
import com.SmartCampus.SmartCampus.Entity.enums.BookingStatus;
import com.SmartCampus.SmartCampus.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // 1. POST: Create a new booking request
    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(@RequestBody Booking booking) {
        try {
            Booking savedBooking = bookingService.createBooking(booking);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Booking created successfully (PENDING)", savedBooking));
        } catch (RuntimeException e) {
            // Returns 409 Conflict if time slot overlaps
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 2. GET: View all bookings, or filter by specific user
    @GetMapping
    public ResponseEntity<ApiResponse<List<Booking>>> getBookings(@RequestParam(required = false) String userId) {
        List<Booking> bookings;
        if (userId != null) {
            bookings = bookingService.getBookingsByUser(userId);
        } else {
            bookings = bookingService.getAllBookings(); 
        }
        return ResponseEntity.ok(ApiResponse.success("Fetched bookings successfully", bookings));
    }

    // 3. PUT/PATCH: Update Booking Status (e.g. Admin Approval)
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Booking>> updateBookingStatus(
            @PathVariable String id,
            @RequestParam BookingStatus status,
            @RequestParam(required = false) String rejectionReason,
            @RequestParam(required = false) String reviewedBy) {
        try {
            Booking updatedBooking = bookingService.updateStatus(id, status, rejectionReason, reviewedBy);
            return ResponseEntity.ok(ApiResponse.success("Booking status updated to " + status, updatedBooking));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 4. DELETE: Delete a pending booking
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable String id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok(ApiResponse.success("Booking deleted successfully", null));
        } catch (RuntimeException e) {
            // Returns 400 Bad Request if trying to delete a non-pending booking
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
