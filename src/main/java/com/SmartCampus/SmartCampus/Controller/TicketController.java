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
@CrossOrigin(origins = "http://localhost:5173") // optional, works with global CORS
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<ApiResponse<TicketResponse>> createTicket(
            @Valid @RequestBody CreateTicketRequest request) {

        TicketResponse ticket = ticketService.createTicket(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Incident ticket created successfully", ticket));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketSummaryResponse>>> getAllTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) Priority priority) {

        List<TicketSummaryResponse> tickets = ticketService.getAllTicketsFiltered(status, priority);
        return ResponseEntity.ok(ApiResponse.success("Tickets retrieved successfully", tickets));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<TicketSummaryResponse>>> getMyTickets() {
        List<TicketSummaryResponse> tickets = ticketService.getMyTickets();
        return ResponseEntity.ok(ApiResponse.success("Your tickets retrieved", tickets));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketById(@PathVariable String id) {
        TicketResponse ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ApiResponse.success("Ticket retrieved successfully", ticket));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<ApiResponse<TicketResponse>> updateTicketStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateTicketStatusRequest request) {

        TicketResponse ticket = ticketService.updateTicketStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Ticket status updated", ticket));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TicketResponse>> assignTechnician(
            @PathVariable String id,
            @RequestParam String technicianId) {

        TicketResponse ticket = ticketService.assignTechnician(id, technicianId);
        return ResponseEntity.ok(ApiResponse.success("Technician assigned successfully", ticket));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok(ApiResponse.success("Ticket deleted successfully", null));
    }
}
