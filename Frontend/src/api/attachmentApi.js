import axiosInstance from "./axiosInstance";

// POST upload photo (multipart form)
export const uploadAttachment = (ticketId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosInstance.post(`/tickets/${ticketId}/attachments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// GET all attachments for a ticket
export const getAttachments = (ticketId) =>
  axiosInstance.get(`/tickets/${ticketId}/attachments`);

// DELETE attachment
export const deleteAttachment = (ticketId, attachmentId) =>
  axiosInstance.delete(`/tickets/${ticketId}/attachments/${attachmentId}`);
