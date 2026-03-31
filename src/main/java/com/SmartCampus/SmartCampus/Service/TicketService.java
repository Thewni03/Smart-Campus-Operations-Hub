package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Dto.Request.CreateTicketRequest;
import com.SmartCampus.SmartCampus.Dto.Request.UpdateTicketStatusRequest;
import com.SmartCampus.SmartCampus.Dto.Response.TicketResponse;
import com.SmartCampus.SmartCampus.Dto.Response.TicketSummaryResponse;
import com.SmartCampus.SmartCampus.Entity.enums.Priority;
import com.SmartCampus.SmartCampus.Entity.enums.TicketStatus;

import java.util.List;

public interface TicketService {

    // User creates a new incident ticket
    TicketResponse createTicket(CreateTicketRequest request);

    // Get full ticket detail by ID
    TicketResponse getTicketById(String id);

    // Get all tickets — admin sees all, user sees only their own
    List<TicketSummaryResponse> getAllTickets();

    // Get only tickets reported by the current user
    List<TicketSummaryResponse> getMyTickets();

    // Admin: get all tickets with optional filters
    List<TicketSummaryResponse> getAllTicketsFiltered(TicketStatus status, Priority priority);
    // Admin / Technician: update status, add resolution notes, assign technician
    TicketResponse updateTicketStatus(String id, UpdateTicketStatusRequest request);

    // Admin: assign a technician to a ticket
    TicketResponse assignTechnician(String ticketId, String technicianId);

    // Delete ticket — admin only
    void deleteTicket(String id);
}