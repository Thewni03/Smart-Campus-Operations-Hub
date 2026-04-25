package com.SmartCampus.SmartCampus.Controller;

import com.SmartCampus.SmartCampus.Dto.Request.UpdateResolutionRequest;
import com.SmartCampus.SmartCampus.Dto.Request.UpdateTicketStatusRequest;
import com.SmartCampus.SmartCampus.Dto.Response.ApiResponse;
import com.SmartCampus.SmartCampus.Dto.Response.TicketResponse;
import com.SmartCampus.SmartCampus.Service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/technician/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TechnicianTicketController {

    private final TicketService ticketService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getMyAssignedTickets() {
        return ResponseEntity.ok(ApiResponse.success("Assigned technician tickets retrieved", ticketService.getMyAssignedTechnicianTickets()));
    }

    @PatchMapping("/{ticketId}/status")
    public ResponseEntity<ApiResponse<TicketResponse>> updateTechnicianStatus(
            @PathVariable String ticketId,
            @Valid @RequestBody UpdateTicketStatusRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Ticket status updated", ticketService.updateTechnicianTicketStatus(ticketId, request)));
    }

    @PatchMapping("/{ticketId}/resolution")
    public ResponseEntity<ApiResponse<TicketResponse>> updateResolution(
            @PathVariable String ticketId,
            @Valid @RequestBody UpdateResolutionRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Resolution notes updated", ticketService.updateTechnicianResolution(ticketId, request)));
    }
}
