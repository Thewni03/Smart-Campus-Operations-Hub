import axiosInstance from "./axiosInstance";

export const getMyNotifications = () =>
  axiosInstance.get("/notifications/my");

export const markNotificationAsRead = (notificationId) =>
  axiosInstance.patch(`/notifications/${notificationId}/read`);

export const markAllNotificationsAsRead = () =>
  axiosInstance.patch("/notifications/read-all");
