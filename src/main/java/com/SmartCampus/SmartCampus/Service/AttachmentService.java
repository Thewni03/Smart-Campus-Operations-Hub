package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Dto.Response.AttachmentResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentService {

    // Upload a photo for a ticket (max 3 per ticket enforced here)
    AttachmentResponse uploadAttachment(String ticketId, MultipartFile file);

    // Get all attachments for a ticket
    List<AttachmentResponse> getAttachmentsByTicket(String ticketId);

    // Delete a specific attachment — uploader or admin only
    void deleteAttachment(String attachmentId);
}