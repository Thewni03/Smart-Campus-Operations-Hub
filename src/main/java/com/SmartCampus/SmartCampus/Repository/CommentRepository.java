package com.SmartCampus.SmartCampus.Repository;

import com.SmartCampus.SmartCampus.Entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {

    // Get all comments for a ticket (oldest first)
    List<Comment> findByTicketIdOrderByCreatedAtAsc(String ticketId);

    // Delete all comments when a ticket is deleted
    void deleteAllByTicketId(String ticketId);

    // Count comments per ticket
    long countByTicketId(String ticketId);
}
