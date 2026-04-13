import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const navItems = [
    { to: "/home", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/tickets", label: "Tickets" },
    { to: "/tickets/create", label: "Create Ticket" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="topbar">
      <div className="topbar__left">
        <NavLink to="/home" className="topbar__brand">
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
              className={({ isActive }) =>
                `topbar__link ${isActive ? "topbar__link--active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAdmin() && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `topbar__link ${isActive ? "topbar__link--active" : ""}`
              }
            >
              Admin
            </NavLink>
          )}
        </div>
      </div>

      <div className="topbar__right">
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
