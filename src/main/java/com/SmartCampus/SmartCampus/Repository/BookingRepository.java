package com.SmartCampus.SmartCampus.Repository;

import com.SmartCampus.SmartCampus.Entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    @Query(value = "{ 'resourceId': ?0, 'bookingDate': ?1, 'status': { $in: ['PENDING', 'APPROVED'] }, '$and': [ { 'startTime': { $lt: ?3 } }, { 'endTime': { $gt: ?2 } } ] }", count = true)
    long countConflictingBookings(String resourceId, LocalDate bookingDate, LocalTime startTime, LocalTime endTime);

    java.util.List<Booking> findByUserId(String userId);
}
