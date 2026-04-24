package com.SmartCampus.SmartCampus.Exception;

public class NotificationNotFoundException extends RuntimeException {
    public NotificationNotFoundException(String notificationId) {
        super("Notification not found with id: " + notificationId);
    }
}
