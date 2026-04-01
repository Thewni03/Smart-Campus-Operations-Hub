package com.SmartCampus.SmartCampus.Repository;

import com.SmartCampus.SmartCampus.Entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.resourceId = :resourceId " +
            "AND b.status IN ('PENDING', 'APPROVED') " +
            "AND ((b.startTime < :endTime) AND (b.endTime > :startTime))")
    long countConflictingBookings(@Param("resourceId") Long resourceId,
                                  @Param("startTime") LocalDateTime startTime,
                                  @Param("endTime") LocalDateTime endTime);
}
