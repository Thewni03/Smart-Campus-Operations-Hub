import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../api/notificationApi";

const POLL_INTERVAL_MS = 60000;

const useNavbarNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyNotifications();
      setNotifications(response.data.data || []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const intervalId = window.setInterval(fetchNotifications, POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [fetchNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const markAllAsRead = useCallback(async () => {
    await markAllNotificationsAsRead();
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true }))
    );
  }, []);

  const markOneAsRead = useCallback(async (notificationId) => {
    await markNotificationAsRead(notificationId);
    setNotifications((current) =>
      current.map((item) =>
        item.id === notificationId ? { ...item, read: true } : item
      )
    );
  }, []);

  return {
    loading,
    unreadCount,
    notifications,
    markAllAsRead,
    markOneAsRead,
    refetch: fetchNotifications,
  };
};

export default useNavbarNotifications;
