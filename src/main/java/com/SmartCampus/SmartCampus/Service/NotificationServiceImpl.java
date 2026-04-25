package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Dto.Response.NotificationResponse;
import com.SmartCampus.SmartCampus.Entity.Notification;
import com.SmartCampus.SmartCampus.Entity.enums.NotificationType;
import com.SmartCampus.SmartCampus.Exception.NotificationNotFoundException;
import com.SmartCampus.SmartCampus.Exception.UnauthorizedActionException;
import com.SmartCampus.SmartCampus.Repository.NotificationRepository;
import com.SmartCampus.SmartCampus.Util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final SecurityUtil securityUtil;

    @Override
    public List<NotificationResponse> getMyNotifications() {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(securityUtil.getCurrentUserId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public NotificationResponse markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException(notificationId));

        if (!notification.getUserId().equals(securityUtil.getCurrentUserId())) {
            throw new UnauthorizedActionException("You are not allowed to access this notification");
        }

        notification.setRead(true);
        return mapToResponse(notificationRepository.save(notification));
    }

    @Override
    public void markAllAsRead() {
        String userId = securityUtil.getCurrentUserId();
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Override
    public void createNotification(String userId, String message, NotificationType type, String ticketId) {
        createNotification(userId, message, type, ticketId, null);
    }

    @Override
    public void createNotification(String userId, String message, NotificationType type, String ticketId, String resourceId) {
        if (userId == null || userId.isBlank()) {
            return;
        }

        Notification notification = Notification.builder()
                .userId(userId)
                .message(message)
                .type(type)
                .read(false)
                .ticketId(ticketId)
                .resourceId(resourceId)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getTicketId(),
                notification.getResourceId(),
                notification.getCreatedAt()
        );
    }
}
