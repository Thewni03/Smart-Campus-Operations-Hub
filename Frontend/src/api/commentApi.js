import axiosInstance from "./axiosInstance";

// GET all comments for a ticket
export const getComments = (ticketId) =>
  axiosInstance.get(`/tickets/${ticketId}/comments`);

// POST add comment
export const addComment = (ticketId, data) =>
  axiosInstance.post(`/tickets/${ticketId}/comments`, data);

// PUT edit comment
export const updateComment = (ticketId, commentId, data) =>
  axiosInstance.put(`/tickets/${ticketId}/comments/${commentId}`, data);

// DELETE comment
export const deleteComment = (ticketId, commentId) =>
  axiosInstance.delete(`/tickets/${ticketId}/comments/${commentId}`);
