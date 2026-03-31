package com.SmartCampus.SmartCampus.Controller;

import com.SmartCampus.SmartCampus.Dto.Request.CreateTicketRequest;
import com.SmartCampus.SmartCampus.Dto.Request.UpdateTicketStatusRequest;
import com.SmartCampus.SmartCampus.Dto.Response.ApiResponse;
import com.SmartCampus.SmartCampus.Dto.Response.TicketResponse;
import com.SmartCampus.SmartCampus.Dto.Response.TicketSummaryResponse;
import com.SmartCampus.SmartCampus.Entity.enums.Priority;
import com.SmartCampus.SmartCampus.Entity.enums.TicketStatus;
import com.SmartCampus.SmartCampus.Service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    /**
     * POST /api/tickets
     * Create a new incident ticket.
     * Any authenticated user can report an incident.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TicketResponse>> createTicket(
            @Valid @RequestBody CreateTicketRequest request) {

        TicketResponse ticket = ticketService.createTicket(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Incident ticket created successfully", ticket));
    }

    /**
     * GET /api/tickets
     * Get all tickets.
     * Admin: sees all tickets with optional filters.
     * User: sees only their own tickets.
     * Optional query params: ?status=OPEN&priority=CRITICAL
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketSummaryResponse>>> getAllTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) Priority priority) {

        List<TicketSummaryResponse> tickets = ticketService.getAllTicketsFiltered(status, priority);
        return ResponseEntity.ok(ApiResponse.success("Tickets retrieved successfully", tickets));
    }

    /**
     * GET /api/tickets/my
     * Get current user's own tickets only.
     */
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<TicketSummaryResponse>>> getMyTickets() {
        List<TicketSummaryResponse> tickets = ticketService.getMyTickets();
        return ResponseEntity.ok(ApiResponse.success("Your tickets retrieved", tickets));
    }

    /**
     * GET /api/tickets/{id}
     * Get full detail of a specific ticket by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketById(@PathVariable String id) {
        TicketResponse ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ApiResponse.success("Ticket retrieved successfully", ticket));
    }

    /**
     * PATCH /api/tickets/{id}/status
     * Update ticket status — ADMIN or assigned TECHNICIAN only.
     * Handles: IN_PROGRESS, RESOLVED, CLOSED, REJECTED (with reason).
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<ApiResponse<TicketResponse>> updateTicketStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateTicketStatusRequest request) {

        TicketResponse ticket = ticketService.updateTicketStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Ticket status updated", ticket));
    }

    /**
     * PATCH /api/tickets/{id}/assign
     * Assign a technician to a ticket — ADMIN only.
     * Query param: ?technicianId=userId
     */
    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TicketResponse>> assignTechnician(
            @PathVariable String id,
            @RequestParam String technicianId) {

        TicketResponse ticket = ticketService.assignTechnician(id, technicianId);
        return ResponseEntity.ok(ApiResponse.success("Technician assigned successfully", ticket));
    }

    /**
     * DELETE /api/tickets/{id}
     * Delete a ticket — ADMIN only.
     * Also deletes all associated comments and attachments.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok(ApiResponse.success("Ticket deleted successfully", null));
    }
}