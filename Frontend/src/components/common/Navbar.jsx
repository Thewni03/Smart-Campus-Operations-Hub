import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-bold text-gray-900 text-lg tracking-tight">
          SmartCampus
        </Link>
        <div className="flex gap-4 text-sm">
          <Link to="/tickets" className="text-gray-600 hover:text-gray-900 transition-colors">
            Tickets
          </Link>
          <Link to="/tickets/create" className="text-gray-600 hover:text-gray-900 transition-colors">
            Report Incident
          </Link>
          {isAdmin() && (
            <Link to="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
              Admin
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <span className="text-sm text-gray-500">
            {user.name || user.email}
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {user.role}
            </span>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
