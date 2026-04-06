import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TicketListPage from "./pages/TicketListPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

import UserResource from "./components/UserResource/UserResource";
import AdminResource from "./components/Adminresource/Adminresource";

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/tickets"element={<MainLayout><TicketListPage /></MainLayout>}/>
          <Route path="/tickets/create"element={<MainLayout><CreateTicketPage /></MainLayout>}/>
          <Route path="/tickets/:id" element={<MainLayout><TicketDetailPage /></MainLayout>}/>
          <Route path="/admin"element={<MainLayout> <AdminDashboardPage /></MainLayout>}/>
          <Route path="/resource"element={ <MainLayout> <UserResource /> </MainLayout> } />
          <Route path="/admin-resources" element={ <MainLayout> <AdminResource /> </MainLayout>}/>
          <Route path="*" element={<MainLayout> <NotFoundPage /></MainLayout>}/>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;