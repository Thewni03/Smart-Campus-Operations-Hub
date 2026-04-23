import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TicketListPage from "./pages/TicketListPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

import UserResource from "./components/UserResource/UserResource";
import AdminResource from "./components/Adminresource/Adminresource";

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const getDefaultRoute = (user) => (user?.role === "ADMIN" ? "/admin" : "/home");

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

const UserRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin()) {
    return <Navigate to="/admin" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={getDefaultRoute(user)} replace />;
  }

  return children;
};

const RootRoute = () => {
  const { user } = useAuth();

  return <Navigate to={user ? getDefaultRoute(user) : "/login"} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route
            path="/home"
            element={
              <UserRoute>
                <HomePage />
              </UserRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <SignupPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <UserRoute>
                <UserDashboardPage />
              </UserRoute>
            }
          />
          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <TicketListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/create"
            element={
              <ProtectedRoute>
                <CreateTicketPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <TicketDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/resource"
            element={
              <UserRoute>
                <UserResource />
              </UserRoute>
            }
          />
          <Route
            path="/admin-resources"
            element={
              <AdminRoute>
                <AdminResource />
              </AdminRoute>
            }
          />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <NotFoundPage />
              </ProtectedRoute>
            }
          />
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
