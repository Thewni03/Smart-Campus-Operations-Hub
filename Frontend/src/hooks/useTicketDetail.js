import { useState, useEffect } from "react";
import { getTicketById, updateTicketStatus, assignTechnician } from "../api/ticketApi";

const useTicketDetail = (id) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await getTicketById(id);
      setTicket(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Ticket not found");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (statusData) => {
    const res = await updateTicketStatus(id, statusData);
    setTicket(res.data.data);
  };

  const assign = async (technicianId) => {
    const res = await assignTechnician(id, technicianId);
    setTicket(res.data.data);
  };

  useEffect(() => { if (id) fetchTicket(); }, [id]);

  return { ticket, loading, error, changeStatus, assign, refetch: fetchTicket };
};

export default useTicketDetail;
