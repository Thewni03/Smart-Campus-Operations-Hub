package com.SmartCampus.SmartCampus.Controller;

import com.SmartCampus.SmartCampus.Dto.Response.ApiResponse;
import com.SmartCampus.SmartCampus.Dto.Response.AttachmentResponse;
import com.SmartCampus.SmartCampus.Service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@RestController
@RequestMapping("/api/tickets/{ticketId}/attachments")
@RequiredArgsConstructor
public class AttachmentController {


    private final AttachmentService attachmentService;

    /**
     * POST /api/tickets/{ticketId}/attachments
     * Upload a photo evidence for a ticket.
     * Max 3 photos per ticket — enforced in service layer.
     * Accepts: multipart/form-data with key "file"
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<AttachmentResponse>> uploadAttachment(
            @PathVariable String ticketId,
            @RequestParam("file") MultipartFile file) {

        AttachmentResponse attachment = attachmentService.uploadAttachment(ticketId, file);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Attachment uploaded successfully", attachment));
    }

    /**
     * GET /api/tickets/{ticketId}/attachments
     * Get all attachments for a ticket.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AttachmentResponse>>> getAttachments(
            @PathVariable String ticketId) {

        List<AttachmentResponse> attachments = attachmentService.getAttachmentsByTicket(ticketId);
        return ResponseEntity.ok(ApiResponse.success("Attachments retrieved successfully", attachments));
    }

    /**
     * DELETE /api/tickets/{ticketId}/attachments/{attachmentId}
     * Delete an attachment — only the uploader or admin.
     */
    @DeleteMapping("/{attachmentId}")
    public ResponseEntity<ApiResponse<Void>> deleteAttachment(
            @PathVariable String ticketId,
            @PathVariable String attachmentId) {

        attachmentService.deleteAttachment(attachmentId);
        return ResponseEntity.ok(ApiResponse.success("Attachment deleted successfully", null));
    }
}