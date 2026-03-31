package com.SmartCampus.SmartCampus.Repository;

import com.SmartCampus.SmartCampus.Entity.Ticket;
import com.SmartCampus.SmartCampus.Entity.enums.Priority;
import com.SmartCampus.SmartCampus.Entity.enums.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

    // Find all tickets reported by a specific user
    List<Ticket> findByReportedBy(String userId);

    // Find all tickets assigned to a specific technician
    List<Ticket> findByAssignedTo(String technicianId);

    // Filter by status
    List<Ticket> findByStatus(TicketStatus status);

    // Filter by priority
    List<Ticket> findByPriority(Priority priority);

    // Filter by status AND priority (admin dashboard filtering)
    List<Ticket> findByStatusAndPriority(TicketStatus status, Priority priority);

    // Find all tickets for a specific resource
    List<Ticket> findByResourceId(String resourceId);

    // Unassigned open tickets (for admin assignment panel)
    List<Ticket> findByAssignedToIsNullAndStatus(TicketStatus status);
}
