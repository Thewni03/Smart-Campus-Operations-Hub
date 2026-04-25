package com.SmartCampus.SmartCampus.Service;

import com.SmartCampus.SmartCampus.Dto.Response.NotificationResponse;
import com.SmartCampus.SmartCampus.Entity.enums.NotificationType;

import java.util.List;

public interface NotificationService {

    List<NotificationResponse> getMyNotifications();

    NotificationResponse markAsRead(String notificationId);

    void markAllAsRead();

    void createNotification(String userId, String message, NotificationType type, String ticketId);

    void createNotification(String userId, String message, NotificationType type, String ticketId, String resourceId);
}
