package com.SmartCampus.SmartCampus.Repository;

import com.SmartCampus.SmartCampus.Entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    @Query(value = "{ 'resourceId': ?0, 'status': { $in: ['PENDING', 'APPROVED'] }, '$and': [ { 'startTime': { $lt: ?2 } }, { 'endTime': { $gt: ?1 } } ] }", count = true)
    long countConflictingBookings(String resourceId, LocalDateTime startTime, LocalDateTime endTime);
}
