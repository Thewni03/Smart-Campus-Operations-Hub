package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Dto.Request.CreateTicketRequest;
import com.SmartCampus.SmartCampus.Dto.Request.UpdateTicketStatusRequest;
import com.SmartCampus.SmartCampus.Dto.Response.AttachmentResponse;
import com.SmartCampus.SmartCampus.Dto.Response.TicketResponse;
import com.SmartCampus.SmartCampus.Dto.Response.TicketSummaryResponse;
import com.SmartCampus.SmartCampus.Entity.Ticket;
import com.SmartCampus.SmartCampus.Entity.TicketAttachment;
import com.SmartCampus.SmartCampus.Entity.enums.Priority;
import com.SmartCampus.SmartCampus.Entity.enums.TicketStatus;
import com.SmartCampus.SmartCampus.Exception.TicketNotFoundException;
import com.SmartCampus.SmartCampus.Exception.UnauthorizedActionException;
import com.SmartCampus.SmartCampus.Repository.AttachmentRepository;
import com.SmartCampus.SmartCampus.Repository.CommentRepository;
import com.SmartCampus.SmartCampus.Repository.TicketRepository;
import com.SmartCampus.SmartCampus.Util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final AttachmentRepository attachmentRepository;
    private final CommentRepository commentRepository;
    private final SecurityUtil securityUtil;

    @Override
    public TicketResponse createTicket(CreateTicketRequest request) {
        String currentUserId = securityUtil.getCurrentUserId();

        Ticket ticket = Ticket.builder()
                .reportedBy(currentUserId)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority())
                .status(TicketStatus.OPEN)
                .resourceId(request.getResourceId())
                .location(request.getLocation())
                .contactDetails(request.getContactDetails())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Ticket saved = ticketRepository.save(ticket);
        return mapToTicketResponse(saved);
    }

    @Override
    public TicketResponse getTicketById(String id) {
        Ticket ticket = findTicketOrThrow(id);
        String currentUserId = securityUtil.getCurrentUserId();

        boolean canView = securityUtil.isAdmin()
                || currentUserId.equals(ticket.getReportedBy())
                || currentUserId.equals(ticket.getAssignedTo());

        if (!canView) {
            throw new UnauthorizedActionException("You are not allowed to view this ticket");
        }

        return mapToTicketResponse(ticket);
    }

    @Override
    public List<TicketSummaryResponse> getAllTickets() {
        // Admin sees all; regular user sees only their own
        if (securityUtil.isAdmin()) {
            return ticketRepository.findAll()
                    .stream()
                    .map(this::mapToSummary)
                    .toList();
        }
        return getMyTickets();
    }

    @Override
    public List<TicketSummaryResponse> getMyTickets() {
        String userId = securityUtil.getCurrentUserId();
        return ticketRepository.findByReportedBy(userId)
                .stream()
                .map(this::mapToSummary)
                .toList();
    }

    @Override
    public List<TicketSummaryResponse> getAllTicketsFiltered(TicketStatus status, Priority priority) {
        List<Ticket> tickets;

        if (securityUtil.isAdmin()) {
            if (status != null && priority != null) {
                tickets = ticketRepository.findByStatusAndPriority(status, priority);
            } else if (status != null) {
                tickets = ticketRepository.findByStatus(status);
            } else if (priority != null) {
                tickets = ticketRepository.findByPriority(priority);
            } else {
                tickets = ticketRepository.findAll();
            }
        } else {
            String userId = securityUtil.getCurrentUserId();
            tickets = ticketRepository.findByReportedBy(userId).stream()
                    .filter(ticket -> status == null || ticket.getStatus() == status)
                    .filter(ticket -> priority == null || ticket.getPriority() == priority)
                    .toList();
        }

        return tickets.stream().map(this::mapToSummary).toList();
    }

    @Override
    public TicketResponse updateTicketStatus(String id, UpdateTicketStatusRequest request) {
        Ticket ticket = findTicketOrThrow(id);

        // Only admin or the assigned technician can update status
        String currentUserId = securityUtil.getCurrentUserId();
        boolean isAdminOrAssigned = securityUtil.isAdmin()
                || currentUserId.equals(ticket.getAssignedTo());

        if (!isAdminOrAssigned) {
            throw new UnauthorizedActionException(
                    "Only an admin or assigned technician can update this ticket's status"
            );
        }

        // Validate rejection requires a reason
        if (request.getStatus() == TicketStatus.REJECTED
                && (request.getRejectionReason() == null || request.getRejectionReason().isBlank())) {
            throw new IllegalArgumentException("Rejection reason is required when rejecting a ticket");
        }

        ticket.setStatus(request.getStatus());
        ticket.setUpdatedAt(LocalDateTime.now());

        if (request.getRejectionReason() != null) {
            ticket.setRejectionReason(request.getRejectionReason());
        }
        if (request.getResolutionNotes() != null) {
            ticket.setResolutionNotes(request.getResolutionNotes());
        }
        if (request.getAssignedTo() != null) {
            ticket.setAssignedTo(request.getAssignedTo());
        }

        return mapToTicketResponse(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponse assignTechnician(String ticketId, String technicianId) {
        if (!securityUtil.isAdmin()) {
            throw new UnauthorizedActionException("Only an admin can assign a technician");
        }

        Ticket ticket = findTicketOrThrow(ticketId);
        ticket.setAssignedTo(technicianId);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        ticket.setUpdatedAt(LocalDateTime.now());
        return mapToTicketResponse(ticketRepository.save(ticket));
    }

    @Override
    public void deleteTicket(String id) {
        if (!securityUtil.isAdmin()) {
            throw new UnauthorizedActionException("Only an admin can delete a ticket");
        }

        Ticket ticket = findTicketOrThrow(id);
        // Cascade delete comments and attachments
        commentRepository.deleteAllByTicketId(id);
        attachmentRepository.deleteAllByTicketId(id);
        ticketRepository.delete(ticket);
    }

    // ── private helpers ──────────────────────────────────

    private Ticket findTicketOrThrow(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
    }

    private TicketResponse mapToTicketResponse(Ticket ticket) {
        List<AttachmentResponse> attachments = attachmentRepository
                .findByTicketId(ticket.getId())
                .stream()
                .map(this::mapToAttachmentResponse)
                .toList();

        return new TicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getLocation(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getReportedBy(),
                ticket.getAssignedTo(),
                ticket.getResourceId(),
                ticket.getContactDetails(),
                ticket.getRejectionReason(),
                ticket.getResolutionNotes(),
                attachments,
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }

    private TicketSummaryResponse mapToSummary(Ticket ticket) {
        int attachmentCount = (int) attachmentRepository.countByTicketId(ticket.getId());
        return new TicketSummaryResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getReportedBy(),
                ticket.getAssignedTo(),
                attachmentCount,
                ticket.getCreatedAt()
        );
    }

    private AttachmentResponse mapToAttachmentResponse(TicketAttachment a) {
        return new AttachmentResponse(
                a.getId(),
                a.getTicketId(),
                a.getFileName(),
                a.getFileUrl(),
                a.getFileType(),
                a.getFileSize(),
                a.getUploadedAt()
        );
    }
}
