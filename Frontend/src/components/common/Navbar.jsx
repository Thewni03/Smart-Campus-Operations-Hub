import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useNavbarNotifications from "../../hooks/useNavbarNotifications";
import { formatDateTime } from "../../utils/formatDate";

const Navbar = () => {
  const { user, logout, isAdmin, isTechnicianOnly } = useAuth();
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const {
    loading,
    unreadCount,
    notifications,
    markAllAsRead,
    markOneAsRead,
  } = useNavbarNotifications();

  const navItems = isAdmin()
    ? [{ to: "/admin", label: "Admin Dashboard" }]
    : isTechnicianOnly()
      ? [
          { to: "/technician/dashboard", label: "Technician Dashboard" },
          { to: "/tickets", label: "Tickets" },
        ]
    : [
        { to: "/home", label: "Home" },
        { to: "/dashboard", label: "Dashboard" },
        { to: "/resource", label: "Resources" },
        { to: "/tickets", label: "Tickets" },
        { to: "/my-bookings", label: "My Bookings" },
      ];
  const brandRoute = isAdmin()
    ? "/admin"
    : isTechnicianOnly()
      ? "/technician/dashboard"
      : "/home";

  useEffect(() => {
    if (!isPanelOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isPanelOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNotificationToggle = () => {
    setIsPanelOpen((current) => !current);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markOneAsRead(notification.id);
    }
    setIsPanelOpen(false);

    if (notification.ticketId) {
      navigate(`/tickets/${notification.ticketId}`);
      return;
    }

    if (notification.resourceId || notification.type?.startsWith("RESOURCE_")) {
      navigate(isAdmin() ? "/admin-resources" : "/resource");
    }
  };

  const formatNotificationType = (type) =>
    type?.replaceAll("_", " ").toLowerCase() || "notification";

  return (
    <nav className="topbar">
      <div className="topbar__left">
        <NavLink to={brandRoute} className="topbar__brand">
          <span className="topbar__brand-mark">SC</span>
          <span className="topbar__brand-text">
            <strong>SmartCampus</strong>
            <small>Operations Hub</small>
          </span>
        </NavLink>
      </div>

      <div className="topbar__nav-shell">
        <div className="topbar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `topbar__link ${isActive ? "topbar__link--active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="topbar__right">
        <div className="topbar__notification-wrap" ref={panelRef}>
          <button
            type="button"
            onClick={handleNotificationToggle}
            className={`topbar__notification-button ${isPanelOpen ? "topbar__notification-button--active" : ""}`}
            aria-label="Open notifications"
          >
            <span className="topbar__notification-icon">🔔</span>
            <span className="topbar__notification-label">Notifications</span>
            {unreadCount > 0 && (
              <span className="topbar__notification-badge">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {isPanelOpen && (
            <div className="topbar__notification-panel">
              <div className="topbar__notification-header">
                <div>
                  <strong>Activity Center</strong>
                  <small>Your latest ticket and resource notifications</small>
                </div>
                <button
                  type="button"
                  onClick={() => void markAllAsRead()}
                  className="topbar__notification-action"
                >
                  Mark all read
                </button>
              </div>

              <div className="topbar__notification-list">
                {loading && (
                  <div className="topbar__notification-empty">
                    <strong>Loading updates</strong>
                    <p>Pulling your latest notifications.</p>
                  </div>
                )}

                {!loading && notifications.length === 0 && (
                  <div className="topbar__notification-empty">
                    <strong>No updates yet</strong>
                    <p>New ticket and resource updates will appear here.</p>
                  </div>
                )}

                {!loading &&
                  notifications.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => void handleNotificationClick(item)}
                      className={`topbar__notification-item ${item.read ? "" : "topbar__notification-item--unread"}`}
                    >
                      <span className="topbar__notification-item-copy">
                        <strong>{formatNotificationType(item.type)}</strong>
                        <span className="topbar__notification-item-meta">
                          {formatNotificationType(item.type)} • {item.read ? "read" : "unread"}
                        </span>
                        <span>{item.message}</span>
                      </span>
                      <small>{formatDateTime(item.createdAt)}</small>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {user && (
          <span className="topbar__user">
            <span className="topbar__user-copy">
              <strong>{user.name || user.email}</strong>
              <small>{user.role}</small>
            </span>
            <span className="topbar__role">
              Account
            </span>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="topbar__logout"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
