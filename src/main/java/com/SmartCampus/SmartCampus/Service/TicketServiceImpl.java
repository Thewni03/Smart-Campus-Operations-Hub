package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Dto.Request.CreateTicketRequest;
import com.SmartCampus.SmartCampus.Dto.Request.UpdateResolutionRequest;
import com.SmartCampus.SmartCampus.Dto.Request.UpdateTicketStatusRequest;
import com.SmartCampus.SmartCampus.Dto.Response.AttachmentResponse;
import com.SmartCampus.SmartCampus.Dto.Response.TicketResponse;
import com.SmartCampus.SmartCampus.Dto.Response.TicketSummaryResponse;
import com.SmartCampus.SmartCampus.Dto.Response.TechnicianOptionResponse;
import com.SmartCampus.SmartCampus.Entity.Resource;
import com.SmartCampus.SmartCampus.Entity.Ticket;
import com.SmartCampus.SmartCampus.Entity.TicketAttachment;
import com.SmartCampus.SmartCampus.Entity.UserAccount;
import com.SmartCampus.SmartCampus.Entity.enums.NotificationType;
import com.SmartCampus.SmartCampus.Entity.enums.Priority;
import com.SmartCampus.SmartCampus.Entity.enums.TicketStatus;
import com.SmartCampus.SmartCampus.Exception.InvalidStatusTransitionException;
import com.SmartCampus.SmartCampus.Exception.TicketNotFoundException;
import com.SmartCampus.SmartCampus.Exception.UnauthorizedActionException;
import com.SmartCampus.SmartCampus.Repository.AttachmentRepository;
import com.SmartCampus.SmartCampus.Repository.CommentRepository;
import com.SmartCampus.SmartCampus.Repository.ResourceRepository;
import com.SmartCampus.SmartCampus.Repository.TicketRepository;
import com.SmartCampus.SmartCampus.Repository.UserAccountRepository;
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
    private final ResourceRepository resourceRepository;
    private final UserAccountRepository userAccountRepository;
    private final NotificationService notificationService;
    private final SecurityUtil securityUtil;

    @Override
    public TicketResponse createTicket(CreateTicketRequest request) {
        UserAccount currentUser = getCurrentUserAccount();
        Resource resource = resolveResource(request.getResourceId());

        Ticket ticket = Ticket.builder()
                .reportedBy(currentUser.getId())
                .createdBy(currentUser.getId())
                .createdByName(currentUser.getFullName())
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority())
                .status(TicketStatus.OPEN)
                .resourceId(request.getResourceId())
                .resourceName(resource != null ? resource.getName() : null)
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
                || currentUserId.equals(ticket.getCreatedBy())
                || currentUserId.equals(ticket.getReportedBy())
                || currentUserId.equals(ticket.getAssignedTechnicianId())
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
        if (securityUtil.isTechnicianOnly()) {
            return ticketRepository.findByAssignedTechnicianId(securityUtil.getCurrentUserId())
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
    public List<TicketResponse> getMyAssignedTechnicianTickets() {
        if (!securityUtil.isTechnician()) {
            throw new UnauthorizedActionException("Only technicians can view assigned technician tickets");
        }

        String technicianId = securityUtil.getCurrentUserId();
        return ticketRepository.findByAssignedTechnicianId(technicianId)
                .stream()
                .map(this::mapToTicketResponse)
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
            List<Ticket> baseTickets = securityUtil.isTechnicianOnly()
                    ? ticketRepository.findByAssignedTechnicianId(userId)
                    : ticketRepository.findByReportedBy(userId);

            tickets = baseTickets.stream()
                    .filter(ticket -> status == null || ticket.getStatus() == status)
                    .filter(ticket -> priority == null || ticket.getPriority() == priority)
                    .toList();
        }

        return tickets.stream().map(this::mapToSummary).toList();
    }

    @Override
    public TicketResponse updateTicketStatus(String id, UpdateTicketStatusRequest request) {
        Ticket ticket = findTicketOrThrow(id);
        String currentUserId = securityUtil.getCurrentUserId();

        if (securityUtil.isTechnicianOnly()) {
            assertAssignedTechnician(ticket, currentUserId);
            return updateTechnicianTicketStatus(id, request);
        }

        if (!securityUtil.isAdmin()) {
            throw new UnauthorizedActionException("Only an admin can update this ticket with this endpoint");
        }

        if (request.getStatus() == TicketStatus.REJECTED
                && (request.getRejectionReason() == null || request.getRejectionReason().isBlank())) {
            throw new IllegalArgumentException("Rejection reason is required when rejecting a ticket");
        }

        ticket.setStatus(request.getStatus());
        ticket.setStatus(request.getStatus());
        ticket.setUpdatedAt(LocalDateTime.now());

        if (request.getRejectionReason() != null) {
            ticket.setRejectionReason(request.getRejectionReason());
        }
        if (request.getResolutionNotes() != null) {
            ticket.setResolutionNotes(request.getResolutionNotes());
        }

        return mapToTicketResponse(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponse assignTechnician(String ticketId, String technicianId) {
        if (!securityUtil.isAdmin()) {
            throw new UnauthorizedActionException("Only an admin can assign a technician");
        }

        Ticket ticket = findTicketOrThrow(ticketId);
        UserAccount technician = userAccountRepository.findById(technicianId)
                .orElseThrow(() -> new IllegalArgumentException("Assigned technician not found"));

        if (!"TECHNICIAN".equalsIgnoreCase(technician.getRole())) {
            throw new IllegalArgumentException("Assigned user must have TECHNICIAN role");
        }

        if (ticket.getStatus() == TicketStatus.CLOSED || ticket.getStatus() == TicketStatus.REJECTED) {
            throw new InvalidStatusTransitionException("Closed or rejected tickets cannot be reassigned");
        }

        ticket.setAssignedTo(technician.getId());
        ticket.setAssignedTechnicianId(technician.getId());
        ticket.setAssignedTechnicianName(technician.getFullName());
        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket savedTicket = ticketRepository.save(ticket);

        notificationService.createNotification(
                technician.getId(),
                "You have been assigned a new ticket: " + savedTicket.getTitle(),
                NotificationType.TICKET_ASSIGNED,
                savedTicket.getId()
        );

        return mapToTicketResponse(savedTicket);
    }

    @Override
    public TicketResponse updateTechnicianTicketStatus(String ticketId, UpdateTicketStatusRequest request) {
        Ticket ticket = findTicketOrThrow(ticketId);
        assertAssignedTechnician(ticket, securityUtil.getCurrentUserId());

        TicketStatus currentStatus = ticket.getStatus();
        TicketStatus nextStatus = request.getStatus();

        boolean validTransition =
                (currentStatus == TicketStatus.OPEN && nextStatus == TicketStatus.IN_PROGRESS)
                        || (currentStatus == TicketStatus.IN_PROGRESS && nextStatus == TicketStatus.RESOLVED);

        if (!validTransition) {
            throw new InvalidStatusTransitionException("Technicians can only move OPEN -> IN_PROGRESS or IN_PROGRESS -> RESOLVED");
        }

        ticket.setStatus(nextStatus);
        ticket.setUpdatedAt(LocalDateTime.now());

        if (request.getResolutionNotes() != null && !request.getResolutionNotes().isBlank()) {
            ticket.setResolutionNotes(request.getResolutionNotes().trim());
        }

        Ticket savedTicket = ticketRepository.save(ticket);
        createTechnicianStatusNotifications(savedTicket);
        return mapToTicketResponse(savedTicket);
    }

    @Override
    public TicketResponse updateTechnicianResolution(String ticketId, UpdateResolutionRequest request) {
        Ticket ticket = findTicketOrThrow(ticketId);
        assertAssignedTechnician(ticket, securityUtil.getCurrentUserId());

        String nextNotes = request.getResolutionNotes().trim();
        if (nextNotes.isBlank()) {
            throw new IllegalArgumentException("Resolution notes are required");
        }

        ticket.setResolutionNotes(nextNotes);
        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket savedTicket = ticketRepository.save(ticket);

        notificationService.createNotification(
                savedTicket.getCreatedBy(),
                "Resolution note added to your ticket",
                NotificationType.RESOLUTION_NOTE_ADDED,
                savedTicket.getId()
        );

        return mapToTicketResponse(savedTicket);
    }

    @Override
    public List<TechnicianOptionResponse> getTechnicians() {
        if (!securityUtil.isAdmin()) {
            throw new UnauthorizedActionException("Only admins can view technicians");
        }

        return userAccountRepository.findByRoleIgnoreCase("TECHNICIAN")
                .stream()
                .map(user -> new TechnicianOptionResponse(user.getId(), user.getFullName(), user.getEmail()))
                .toList();
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

    private UserAccount getCurrentUserAccount() {
        String currentUserId = securityUtil.getCurrentUserId();
        return userAccountRepository.findById(currentUserId)
                .orElseThrow(() -> new UnauthorizedActionException("Current user account was not found"));
    }

    private Resource resolveResource(String resourceId) {
        if (resourceId == null || resourceId.isBlank()) {
            return null;
        }
        return resourceRepository.findById(resourceId).orElse(null);
    }

    private void assertAssignedTechnician(Ticket ticket, String technicianId) {
        if (!technicianId.equals(ticket.getAssignedTechnicianId()) && !technicianId.equals(ticket.getAssignedTo())) {
            throw new UnauthorizedActionException("Technicians can only update tickets assigned to them");
        }
    }

    private void createTechnicianStatusNotifications(Ticket ticket) {
        notificationService.createNotification(
                ticket.getCreatedBy(),
                "Your ticket status changed to " + ticket.getStatus().name(),
                NotificationType.TICKET_STATUS_UPDATED,
                ticket.getId()
        );

        if (ticket.getStatus() == TicketStatus.RESOLVED) {
            for (UserAccount admin : userAccountRepository.findByRoleIgnoreCase("ADMIN")) {
                notificationService.createNotification(
                        admin.getId(),
                        "Technician resolved ticket: " + ticket.getTitle(),
                        NotificationType.TICKET_RESOLVED,
                        ticket.getId()
                );
            }
        }
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
                ticket.getResourceName(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getReportedBy(),
                ticket.getCreatedBy(),
                ticket.getCreatedByName(),
                ticket.getAssignedTo(),
                ticket.getAssignedTechnicianId(),
                ticket.getAssignedTechnicianName(),
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
                ticket.getLocation(),
                ticket.getResourceName(),
                ticket.getDescription(),
                ticket.getResolutionNotes(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getReportedBy(),
                ticket.getCreatedBy(),
                ticket.getCreatedByName(),
                ticket.getAssignedTo(),
                ticket.getAssignedTechnicianId(),
                ticket.getAssignedTechnicianName(),
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
