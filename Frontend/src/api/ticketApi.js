import axiosInstance from "./axiosInstance";

// GET all tickets (with optional filters)
export const getAllTickets = (params = {}) =>
  axiosInstance.get("/tickets", { params });

// GET current user's tickets only
export const getMyTickets = () =>
  axiosInstance.get("/tickets/my");

// GET single ticket by ID
export const getTicketById = (id) =>
  axiosInstance.get(`/tickets/${id}`);

// POST create new ticket
export const createTicket = (data) =>
  axiosInstance.post("/tickets", data);

// PATCH update ticket status
export const updateTicketStatus = (id, data) =>
  axiosInstance.patch(`/tickets/${id}/status`, data);

// PATCH assign technician
export const assignTechnician = (ticketId, technicianId) =>
  axiosInstance.patch(`/tickets/${ticketId}/assign`, null, {
    params: { technicianId },
  });

// DELETE ticket (admin only)
export const deleteTicket = (id) =>
  axiosInstance.delete(`/tickets/${id}`);
