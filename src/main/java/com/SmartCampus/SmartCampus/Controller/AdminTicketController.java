package com.SmartCampus.SmartCampus.Controller;

import com.SmartCampus.SmartCampus.Dto.Request.AssignTechnicianRequest;
import com.SmartCampus.SmartCampus.Dto.Response.ApiResponse;
import com.SmartCampus.SmartCampus.Dto.Response.TechnicianOptionResponse;
import com.SmartCampus.SmartCampus.Dto.Response.TicketResponse;
import com.SmartCampus.SmartCampus.Service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminTicketController {

    private final TicketService ticketService;

    @GetMapping("/technicians")
    public ResponseEntity<ApiResponse<List<TechnicianOptionResponse>>> getTechnicians() {
        return ResponseEntity.ok(ApiResponse.success("Technicians retrieved successfully", ticketService.getTechnicians()));
    }

    @PatchMapping("/tickets/{ticketId}/assign")
    public ResponseEntity<ApiResponse<TicketResponse>> assignTechnician(
            @PathVariable String ticketId,
            @Valid @RequestBody AssignTechnicianRequest request
    ) {
        TicketResponse ticket = ticketService.assignTechnician(ticketId, request.getTechnicianId());
        return ResponseEntity.ok(ApiResponse.success("Technician assigned successfully", ticket));
    }
}
