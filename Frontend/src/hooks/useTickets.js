import { useState, useEffect } from "react";
import { getAllTickets, getMyTickets } from "../api/ticketApi";

const useTickets = (filters = {}, myOnly = false) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = myOnly
        ? await getMyTickets()
        : await getAllTickets(filters);
      setTickets(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  return { tickets, loading, error, refetch: fetchTickets };
};

export default useTickets;
