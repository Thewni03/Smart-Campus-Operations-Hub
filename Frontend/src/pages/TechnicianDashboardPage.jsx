import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTechnicianTickets,
  updateTechnicianResolution,
  updateTechnicianTicketStatus,
} from "../api/ticketApi";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { StatusBadge, PriorityBadge } from "../components/tickets/TicketStatusBadge";
import { formatDateTime } from "../utils/formatDate";

const TechnicianDashboardPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingStatus, setSavingStatus] = useState({});
  const [savingResolution, setSavingResolution] = useState({});
  const [resolutionDrafts, setResolutionDrafts] = useState({});

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getTechnicianTickets();
      const items = response.data.data || [];
      setTickets(items);
      setResolutionDrafts(
        Object.fromEntries(items.map((ticket) => [ticket.id, ticket.resolutionNotes || ""]))
      );
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load assigned tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const counts = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter((ticket) => ticket.status === "OPEN").length,
    inProgress: tickets.filter((ticket) => ticket.status === "IN_PROGRESS").length,
    resolved: tickets.filter((ticket) => ticket.status === "RESOLVED").length,
  }), [tickets]);

  const handleStatusUpdate = async (ticketId, status) => {
    try {
      setSavingStatus((current) => ({ ...current, [ticketId]: true }));
      const response = await updateTechnicianTicketStatus(ticketId, { status });
      const updatedTicket = response.data.data;
      setTickets((current) =>
        current.map((ticket) => (ticket.id === ticketId ? updatedTicket : ticket))
      );
      setResolutionDrafts((current) => ({
        ...current,
        [ticketId]: updatedTicket.resolutionNotes || current[ticketId] || "",
      }));
    } catch (requestError) {
      alert(requestError.response?.data?.message || "Status update failed");
    } finally {
      setSavingStatus((current) => ({ ...current, [ticketId]: false }));
    }
  };

  const handleResolutionSave = async (ticketId) => {
    try {
      setSavingResolution((current) => ({ ...current, [ticketId]: true }));
      const response = await updateTechnicianResolution(ticketId, {
        resolutionNotes: resolutionDrafts[ticketId] || "",
      });
      const updatedTicket = response.data.data;
      setTickets((current) =>
        current.map((ticket) => (ticket.id === ticketId ? updatedTicket : ticket))
      );
      setResolutionDrafts((current) => ({
        ...current,
        [ticketId]: updatedTicket.resolutionNotes || "",
      }));
    } catch (requestError) {
      alert(requestError.response?.data?.message || "Resolution note update failed");
    } finally {
      setSavingResolution((current) => ({ ...current, [ticketId]: false }));
    }
  };

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <p className="home-eyebrow">Technician Dashboard</p>
          <h1>Assigned work queue</h1>
          <p className="home-copy">
            Review only the tickets assigned to you, move them into progress,
            resolve them, and keep your resolution notes up to date.
          </p>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={fetchTickets} />}

      {!loading && !error && (
        <>
          <div className="summary-grid">
            {[
              { label: "Assigned", value: counts.total, tone: "blue" },
              { label: "Open", value: counts.open, tone: "gold" },
              { label: "In Progress", value: counts.inProgress, tone: "slate" },
              { label: "Resolved", value: counts.resolved, tone: "green" },
            ].map((card) => (
              <article key={card.label} className={`summary-card summary-card--${card.tone}`}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </article>
            ))}
          </div>

          {tickets.length === 0 ? (
            <article className="home-panel">
              <p className="home-empty">
                No tickets are assigned to you yet.
              </p>
            </article>
          ) : (
            <div className="technician-ticket-grid">
              {tickets.map((ticket) => {
                const canStart = ticket.status === "OPEN";
                const canResolve = ticket.status === "IN_PROGRESS";

                return (
                  <article key={ticket.id} className="technician-ticket-card">
                    <div className="technician-ticket-card__head">
                      <div>
                        <p className="technician-ticket-card__eyebrow">
                          #{ticket.id.slice(-6).toUpperCase()} • {ticket.category}
                        </p>
                        <h2>{ticket.title}</h2>
                        <p className="technician-ticket-card__meta">
                          {ticket.resourceName || ticket.location || "Campus resource"} • {formatDateTime(ticket.createdAt)}
                        </p>
                      </div>
                      <div className="technician-ticket-card__badges">
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                    </div>

                    <div className="technician-ticket-card__section">
                      <strong>Description</strong>
                      <p>{ticket.description}</p>
                    </div>

                    <div className="technician-ticket-card__section">
                      <strong>Resolution notes</strong>
                      <textarea
                        value={resolutionDrafts[ticket.id] || ""}
                        onChange={(event) =>
                          setResolutionDrafts((current) => ({
                            ...current,
                            [ticket.id]: event.target.value,
                          }))
                        }
                        rows={4}
                        placeholder="Add or update the work completed on this ticket"
                      />
                    </div>

                    <div className="technician-ticket-card__actions">
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(ticket.id, "IN_PROGRESS")}
                        disabled={!canStart || savingStatus[ticket.id]}
                        className="home-button home-button--secondary"
                      >
                        {savingStatus[ticket.id] && canStart ? "Saving..." : "Mark In Progress"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(ticket.id, "RESOLVED")}
                        disabled={!canResolve || savingStatus[ticket.id]}
                        className="home-button home-button--primary"
                      >
                        {savingStatus[ticket.id] && canResolve ? "Saving..." : "Mark Resolved"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResolutionSave(ticket.id)}
                        disabled={savingResolution[ticket.id]}
                        className="home-button home-button--ghost"
                      >
                        {savingResolution[ticket.id] ? "Saving..." : "Save Resolution Note"}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                        className="home-button home-button--ghost"
                      >
                        View Ticket Details
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default TechnicianDashboardPage;
