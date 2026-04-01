package com.SmartCampus.SmartCampus.Repository;

import com.SmartCampus.SmartCampus.Entity.TicketComment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends MongoRepository<TicketComment, String> {

    void deleteAllByTicketId(String ticketId);
}
