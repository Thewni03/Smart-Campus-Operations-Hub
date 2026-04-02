package com.SmartCampus.SmartCampus.Controller;

import com.SmartCampus.SmartCampus.Dto.Request.CreateCommentRequest;
import com.SmartCampus.SmartCampus.Dto.Request.UpdateCommentRequest;
import com.SmartCampus.SmartCampus.Dto.Response.ApiResponse;
import com.SmartCampus.SmartCampus.Dto.Response.CommentResponse;
import com.SmartCampus.SmartCampus.Service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    /**
     * POST /api/tickets/{ticketId}/comments
     * Add a comment to a ticket.
     * Any authenticated user or technician can comment.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @PathVariable String ticketId,
            @Valid @RequestBody CreateCommentRequest request) {

        CommentResponse comment = commentService.addComment(ticketId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment added successfully", comment));
    }

    /**
     * GET /api/tickets/{ticketId}/comments
     * Get all comments for a ticket, ordered oldest first.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(
            @PathVariable String ticketId) {

        List<CommentResponse> comments = commentService.getCommentsByTicket(ticketId);
        return ResponseEntity.ok(ApiResponse.success("Comments retrieved successfully", comments));
    }

    /**
     * PUT /api/tickets/{ticketId}/comments/{commentId}
     * Edit a comment — only the author can edit their own comment.
     */
    @PutMapping("/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @Valid @RequestBody UpdateCommentRequest request) {

        CommentResponse comment = commentService.updateComment(commentId, request);
        return ResponseEntity.ok(ApiResponse.success("Comment updated successfully", comment));
    }

    /**
     * DELETE /api/tickets/{ticketId}/comments/{commentId}
     * Delete a comment — only the author or admin.
     */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable String ticketId,
            @PathVariable String commentId) {

        commentService.deleteComment(commentId);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", null));
    }
}