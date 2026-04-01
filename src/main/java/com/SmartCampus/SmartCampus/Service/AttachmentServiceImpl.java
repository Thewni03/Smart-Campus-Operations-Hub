package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Dto.Response.AttachmentResponse;
import com.SmartCampus.SmartCampus.Entity.TicketAttachment;
import com.SmartCampus.SmartCampus.Exception.MaxAttachmentsException;
import com.SmartCampus.SmartCampus.Exception.TicketNotFoundException;
import com.SmartCampus.SmartCampus.Repository.AttachmentRepository;
import com.SmartCampus.SmartCampus.Repository.TicketRepository;
import com.SmartCampus.SmartCampus.Util.FileStorageUtil;
import com.SmartCampus.SmartCampus.Util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService {

    private static final int MAX_ATTACHMENTS = 3;

    private final AttachmentRepository attachmentRepository;
    private final TicketRepository ticketRepository;
    private final FileStorageUtil fileStorageUtil;
    private final SecurityUtil securityUtil;

    @Override
    public AttachmentResponse uploadAttachment(String ticketId, MultipartFile file) {
        // Verify ticket exists
        ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));

        // Enforce max 3 attachments rule
        long currentCount = attachmentRepository.countByTicketId(ticketId);
        if (currentCount >= MAX_ATTACHMENTS) {
            throw new MaxAttachmentsException();
        }

        // Store file and get public URL
        String fileUrl = fileStorageUtil.storeFile(file);
        String currentUserId = securityUtil.getCurrentUserId();

        TicketAttachment attachment = TicketAttachment.builder()
                .ticketId(ticketId)
                .uploadedBy(currentUserId)
                .fileUrl(fileUrl)
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .uploadedAt(LocalDateTime.now())
                .build();

        return mapToResponse(attachmentRepository.save(attachment));
    }

    @Override
    public List<AttachmentResponse> getAttachmentsByTicket(String ticketId) {
        return attachmentRepository.findByTicketId(ticketId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void deleteAttachment(String attachmentId) {
        TicketAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found with id: " + attachmentId));

        // Only uploader or admin can delete
        securityUtil.assertOwnerOrAdmin(attachment.getUploadedBy());

        // Delete physical file from disk
        fileStorageUtil.deleteFile(attachment.getFileUrl());

        // Delete record from MongoDB
        attachmentRepository.delete(attachment);
    }

    // ── private helpers ──────────────────────────────────

    private AttachmentResponse mapToResponse(TicketAttachment a) {
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