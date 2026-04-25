package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Dto.Request.CreateCommentRequest;
import com.SmartCampus.SmartCampus.Dto.Request.UpdateCommentRequest;
import com.SmartCampus.SmartCampus.Dto.Response.CommentResponse;
import com.SmartCampus.SmartCampus.Entity.Comment;
import com.SmartCampus.SmartCampus.Entity.UserAccount;
import com.SmartCampus.SmartCampus.Exception.TicketNotFoundException;
import com.SmartCampus.SmartCampus.Repository.CommentRepository;
import com.SmartCampus.SmartCampus.Repository.TicketRepository;
import com.SmartCampus.SmartCampus.Repository.UserAccountRepository;
import com.SmartCampus.SmartCampus.Util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserAccountRepository userAccountRepository;
    private final SecurityUtil securityUtil;

    @Override
    public CommentResponse addComment(String ticketId, CreateCommentRequest request) {
        // Verify the ticket exists
        ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));

        String currentUserId = securityUtil.getCurrentUserId();
        String currentUserRole = securityUtil.getCurrentUserRole();
        String currentUserName = securityUtil.getCurrentUserName();

        Comment comment = Comment.builder()
                .ticketId(ticketId)
                .authorId(currentUserId)
                .authorName((currentUserName != null && !currentUserName.isBlank())
                        ? currentUserName.trim()
                        : currentUserId)
                .authorRole(currentUserRole)
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .build();

        return mapToResponse(commentRepository.save(comment));
    }

    @Override
    public List<CommentResponse> getCommentsByTicket(String ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CommentResponse updateComment(String commentId, UpdateCommentRequest request) {
        Comment comment = findCommentOrThrow(commentId);

        // Ownership rule: only the author can edit their own comment
        securityUtil.assertOwnerOrAdmin(comment.getAuthorId());

        comment.setContent(request.getContent());
        comment.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(commentRepository.save(comment));
    }

    @Override
    public void deleteComment(String commentId) {
        Comment comment = findCommentOrThrow(commentId);

        // Ownership rule: author or admin can delete
        securityUtil.assertOwnerOrAdmin(comment.getAuthorId());

        commentRepository.delete(comment);
    }

    // ── private helpers ──────────────────────────────────

    private Comment findCommentOrThrow(String id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
    }

    private CommentResponse mapToResponse(Comment comment) {
        String authorName = resolveAuthorName(comment);

        return new CommentResponse(
                comment.getId(),
                comment.getTicketId(),
                comment.getAuthorId(),
                authorName,
                comment.getAuthorRole(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }

    private String resolveAuthorName(Comment comment) {
        UserAccount author = userAccountRepository.findById(comment.getAuthorId()).orElse(null);
        if (author != null && author.getFullName() != null && !author.getFullName().isBlank()) {
            return author.getFullName().trim();
        }

        if (comment.getAuthorName() != null && !comment.getAuthorName().isBlank()) {
            return comment.getAuthorName().trim();
        }

        return comment.getAuthorId();
    }
}
