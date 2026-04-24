import { Link } from "react-router-dom";
import useTickets from "../hooks/useTickets";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { useAuth } from "../context/AuthContext";

const matchesCurrentUser = (ticket, user) => {
  if (!user) return false;

  return (
    ticket.reportedBy === user.userId ||
    ticket.createdBy === user.userId ||
    ticket.assignedTo === user.userId ||
    ticket.assignedTechnicianId === user.userId
  );
};

const UserDashboardPage = () => {
  const { user } = useAuth();
  const { tickets, loading, error, refetch } = useTickets();

  const dashboardTickets = tickets.filter((ticket) =>
    matchesCurrentUser(ticket, user)
  );
  const visibleTickets = dashboardTickets.length > 0 ? dashboardTickets : tickets;
  const openCount = visibleTickets.filter((ticket) => ticket.status === "OPEN").length;
  const inProgressCount = visibleTickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;
  const resolvedCount = visibleTickets.filter(
    (ticket) => ticket.status === "RESOLVED"
  ).length;

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <p className="home-eyebrow">User Dashboard</p>
          <h1>Your ticket summary</h1>
          <p className="home-copy">
            Follow the current ticket load, check progress, and jump back into
            ticket actions from one place.
          </p>
        </div>

        <Link to="/tickets/create" className="home-button home-button--primary">
          Create Ticket
        </Link>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && (
        <>
          <div className="summary-grid">
            {[
              { label: "Visible Tickets", value: visibleTickets.length, tone: "blue" },
              { label: "Open", value: openCount, tone: "gold" },
              { label: "In Progress", value: inProgressCount, tone: "slate" },
              { label: "Resolved", value: resolvedCount, tone: "green" },
            ].map((card) => (
              <article
                key={card.label}
                className={`summary-card summary-card--${card.tone}`}
              >
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </article>
            ))}
          </div>

          <article className="home-panel">
            <div className="home-panel__header">
              <div>
                <p className="home-panel__eyebrow">Ticket Summary</p>
                <h2>Current items</h2>
              </div>
              <Link to="/tickets" className="home-inline-link">
                Ticket list
              </Link>
            </div>

            {visibleTickets.length === 0 ? (
              <p className="home-empty">
                No tickets are visible yet. Start by creating one from the
                button above.
              </p>
            ) : (
              <div className="home-ticket-list">
                {visibleTickets.slice(0, 6).map((ticket) => (
                  <Link
                    key={ticket.id}
                    to={`/tickets/${ticket.id}`}
                    className="home-ticket-item"
                  >
                    <div>
                      <p>{ticket.title}</p>
                      <span>
                        {ticket.priority} priority • {ticket.category}
                      </span>
                    </div>
                    <strong>{ticket.status.replaceAll("_", " ")}</strong>
                  </Link>
                ))}
              </div>
            )}
          </article>
        </>
      )}
    </section>
  );
};

export default UserDashboardPage;
