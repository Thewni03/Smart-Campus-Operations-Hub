package com.SmartCampus.SmartCampus.Repository;

import com.SmartCampus.SmartCampus.Entity.TicketAttachment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends MongoRepository<TicketAttachment, String> {

    List<TicketAttachment> findByTicketId(String ticketId);

    long countByTicketId(String ticketId);

    void deleteAllByTicketId(String ticketId);
}
