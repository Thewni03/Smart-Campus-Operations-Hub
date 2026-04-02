package com.SmartCampus.SmartCampus.Repository;

import com.SmartCampus.SmartCampus.Entity.TicketAttachment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends MongoRepository<TicketAttachment, String> {

    // Get all attachments for a ticket
    List<TicketAttachment> findByTicketId(String ticketId);

    // Count attachments — used to enforce max 3 rule
    long countByTicketId(String ticketId);

    // Delete all attachments when ticket is deleted
    void deleteAllByTicketId(String ticketId);
}
