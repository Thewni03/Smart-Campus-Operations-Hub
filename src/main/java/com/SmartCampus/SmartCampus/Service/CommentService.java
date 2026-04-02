package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Dto.Request.CreateCommentRequest;
import com.SmartCampus.SmartCampus.Dto.Request.UpdateCommentRequest;
import com.SmartCampus.SmartCampus.Dto.Response.CommentResponse;

import java.util.List;

public interface CommentService {

    // Add a comment to a ticket
    CommentResponse addComment(String ticketId, CreateCommentRequest request);

    // Get all comments for a ticket (oldest first)
    List<CommentResponse> getCommentsByTicket(String ticketId);

    // Edit a comment — only the author can edit their own
    CommentResponse updateComment(String commentId, UpdateCommentRequest request);

    // Delete a comment — author or admin
    void deleteComment(String commentId);
}