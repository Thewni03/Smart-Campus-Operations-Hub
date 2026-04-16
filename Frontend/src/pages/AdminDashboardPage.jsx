import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTickets from "../hooks/useTickets";
import { assignTechnician, deleteTicket, updateTicketStatus } from "../api/ticketApi";
import { StatusBadge, PriorityBadge } from "../components/tickets/TicketStatusBadge";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

const TECHNICIANS = [
  { id: "tech-001", name: "Kavindu Perera" },
  { id: "tech-002", name: "Tharuka Fernando" },
  { id: "tech-003", name: "Nilantha Jayasena" },
];

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "◫" },
  { id: "bookings", label: "Bookings", icon: "◧" },
  { id: "tickets", label: "Tickets", icon: "◎" },
];

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { tickets, loading, refetch } = useTickets();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedTech, setSelectedTech] = useState({});
  const [assigning, setAssigning] = useState({});
  const [deleting, setDeleting] = useState({});
  const [rejectForm, setRejectForm] = useState({ ticketId: "", reason: "" });
  const [rejecting, setRejecting] = useState(false);

  const sortedTickets = useMemo(
    () => [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [tickets]
  );

  const openTickets = tickets.filter((ticket) => ticket.status === "OPEN");
  const unassignedTickets = tickets.filter((ticket) => !ticket.assignedTo && ticket.status === "OPEN");
  const inProgressTickets = tickets.filter((ticket) => ticket.status === "IN_PROGRESS");
  const resolvedTickets = tickets.filter((ticket) => ticket.status === "RESOLVED");
  const rejectedTickets = tickets.filter((ticket) => ticket.status === "REJECTED");

  const statCards = [
    {
      label: "Total Tickets",
      value: tickets.length,
      accent: "linear-gradient(135deg, #377dff, #2358c5)",
    },
    {
      label: "Open Queue",
      value: openTickets.length,
      accent: "linear-gradient(135deg, #ffa73d, #f06a2d)",
    },
    {
      label: "In Progress",
      value: inProgressTickets.length,
      accent: "linear-gradient(135deg, #6a5cff, #4130d5)",
    },
    {
      label: "Resolved",
      value: resolvedTickets.length,
      accent: "linear-gradient(135deg, #40b96d, #1b8a4b)",
    },
  ];

  const statusDistribution = [
    { label: "Open", value: openTickets.length, color: "#377dff" },
    { label: "Working", value: inProgressTickets.length, color: "#f08a24" },
    { label: "Resolved", value: resolvedTickets.length, color: "#32a865" },
    { label: "Rejected", value: rejectedTickets.length, color: "#d84f5f" },
  ];

  const maxStatusValue = Math.max(...statusDistribution.map((item) => item.value), 1);

  const handleAssign = async (ticketId) => {
    const technicianId = selectedTech[ticketId];
    if (!technicianId) return;
    setAssigning((current) => ({ ...current, [ticketId]: true }));
    try {
      await assignTechnician(ticketId, technicianId);
      refetch();
    } catch {
      alert("Assignment failed");
    } finally {
      setAssigning((current) => ({ ...current, [ticketId]: false }));
    }
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm("Delete this ticket and related comments/attachments?")) return;
    setDeleting((current) => ({ ...current, [ticketId]: true }));
    try {
      await deleteTicket(ticketId);
      refetch();
    } catch {
      alert("Delete failed");
    } finally {
      setDeleting((current) => ({ ...current, [ticketId]: false }));
    }
  };

  const handleReject = async () => {
    if (!rejectForm.ticketId || !rejectForm.reason.trim()) {
      alert("Select a ticket and enter a reason");
      return;
    }
    setRejecting(true);
    try {
      await updateTicketStatus(rejectForm.ticketId, {
        status: "REJECTED",
        rejectionReason: rejectForm.reason,
      });
      setRejectForm({ ticketId: "", reason: "" });
      refetch();
    } catch {
      alert("Rejection failed");
    } finally {
      setRejecting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <LoadingSpinner />;

  const shell = {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #aebce8 0%, #e8eefb 18%, #f5f7fd 100%)",
    padding: "28px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const frame = {
    maxWidth: "1320px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.84)",
    borderRadius: "34px",
    border: "1px solid rgba(255,255,255,0.72)",
    boxShadow: "0 32px 70px rgba(49, 71, 122, 0.16)",
    backdropFilter: "blur(20px)",
    overflow: "hidden",
  };

  const sidebarLink = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "13px 16px",
    borderRadius: "18px",
    border: "none",
    background: active ? "linear-gradient(135deg, #edf3ff, #dae7ff)" : "transparent",
    color: active ? "#2358c5" : "#5f6f8c",
    font: "inherit",
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "left",
    boxShadow: active ? "0 12px 24px rgba(55, 125, 255, 0.12)" : "none",
  });

  const panel = {
    background: "#ffffff",
    borderRadius: "26px",
    border: "1px solid rgba(221, 229, 244, 0.95)",
    boxShadow: "0 18px 40px rgba(38, 55, 97, 0.08)",
  };

  const sectionTitle = {
    margin: 0,
    color: "#1e2c4f",
    fontSize: "1.1rem",
    fontWeight: 700,
    letterSpacing: "-0.03em",
  };

  const renderDashboard = () => (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "18px" }}>
        {statCards.map((card) => (
          <article
            key={card.label}
            style={{
              ...panel,
              padding: "18px 20px",
              background: "linear-gradient(180deg, #ffffff, #f8fbff)",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "16px",
                background: card.accent,
                boxShadow: "0 12px 22px rgba(55, 125, 255, 0.18)",
                marginBottom: "16px",
              }}
            />
            <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "#1e2c4f", letterSpacing: "-0.04em" }}>
              {card.value}
            </div>
            <div style={{ marginTop: "6px", fontSize: "0.82rem", color: "#7e8da8", textTransform: "uppercase", letterSpacing: ".08em" }}>
              {card.label}
            </div>
          </article>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "18px", marginTop: "18px" }}>
        <section style={{ ...panel, padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h2 style={sectionTitle}>Current Statistic</h2>
            <span style={{ fontSize: "0.8rem", color: "#8a98b1" }}>Live ticket spread</span>
          </div>

          <div style={{ display: "flex", justifyContent: "center", margin: "16px 0 22px" }}>
            <div
              style={{
                width: "190px",
                height: "190px",
                borderRadius: "50%",
                background:
                  "conic-gradient(#377dff 0 31%, #f08a24 31% 57%, #32a865 57% 84%, #d84f5f 84% 100%)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <div
                style={{
                  width: "118px",
                  height: "118px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                  color: "#1e2c4f",
                  fontWeight: 800,
                }}
              >
                {tickets.length}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {statusDistribution.map((item) => (
              <div key={item.label} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "10px", alignItems: "center" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color }} />
                <span style={{ color: "#5f6f8c", fontSize: "0.92rem" }}>{item.label}</span>
                <strong style={{ color: "#1e2c4f" }}>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section style={{ ...panel, padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h2 style={sectionTitle}>Ticket Overview</h2>
            <button
              onClick={() => setActiveSection("tickets")}
              style={{
                border: "none",
                borderRadius: "999px",
                padding: "10px 16px",
                background: "linear-gradient(135deg, #377dff, #2358c5)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Open Ticket Board
            </button>
          </div>

          <div style={{ display: "grid", gap: "14px" }}>
            {statusDistribution.map((item) => (
              <div key={item.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#5f6f8c", fontSize: "0.9rem" }}>
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div style={{ height: "12px", borderRadius: "999px", background: "#edf2fb", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${(item.value / maxStatusValue) * 100}%`,
                      height: "100%",
                      borderRadius: "inherit",
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "14px", marginTop: "20px" }}>
            <article style={{ padding: "16px", borderRadius: "18px", background: "linear-gradient(135deg, #61c954, #42af4f)", color: "#fff" }}>
              <div style={{ fontSize: "0.8rem", opacity: 0.86 }}>Main Focus</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, margin: "10px 0 4px" }}>{unassignedTickets.length}</div>
              <div style={{ fontSize: "0.9rem" }}>Need assignment</div>
            </article>
            <article style={{ padding: "16px", borderRadius: "18px", background: "linear-gradient(135deg, #4e94ff, #377dff)", color: "#fff" }}>
              <div style={{ fontSize: "0.8rem", opacity: 0.86 }}>Technician Load</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, margin: "10px 0 4px" }}>{inProgressTickets.length}</div>
              <div style={{ fontSize: "0.9rem" }}>Running now</div>
            </article>
            <article style={{ padding: "16px", borderRadius: "18px", background: "linear-gradient(135deg, #7863ff, #5d49e7)", color: "#fff" }}>
              <div style={{ fontSize: "0.8rem", opacity: 0.86 }}>Quality Review</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, margin: "10px 0 4px" }}>{rejectedTickets.length}</div>
              <div style={{ fontSize: "0.9rem" }}>Need follow-up</div>
            </article>
          </div>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "18px", marginTop: "18px" }}>
        <section style={{ ...panel, padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={sectionTitle}>Recent Ticket Activity</h2>
            <span style={{ fontSize: "0.8rem", color: "#8a98b1" }}>Latest 5 tickets</span>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            {sortedTickets.slice(0, 5).map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: "12px",
                  alignItems: "center",
                  padding: "14px 16px",
                  borderRadius: "18px",
                  border: "1px solid #edf2fb",
                  background: "#fbfcff",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div>
                  <div style={{ color: "#1e2c4f", fontWeight: 700 }}>{ticket.title}</div>
                  <div style={{ color: "#8a98b1", fontSize: "0.82rem", marginTop: "4px" }}>
                    {ticket.category} • {ticket.assignedTo || "Unassigned"}
                  </div>
                </div>
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </button>
            ))}
          </div>
        </section>

        <section style={{ ...panel, padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={sectionTitle}>Admin Quick Notes</h2>
            <span style={{ fontSize: "0.8rem", color: "#8a98b1" }}>Operations guide</span>
          </div>
          <div style={{ display: "grid", gap: "14px" }}>
            <div style={{ padding: "16px", borderRadius: "18px", background: "#f6f8fd" }}>
              <strong style={{ color: "#1e2c4f" }}>Ticket flow</strong>
              <p style={{ margin: "8px 0 0", color: "#6f7f98", lineHeight: 1.6 }}>
                Admin can move tickets through OPEN, IN_PROGRESS, RESOLVED, CLOSED, or REJECTED with a reason.
              </p>
            </div>
            <div style={{ padding: "16px", borderRadius: "18px", background: "#f6f8fd" }}>
              <strong style={{ color: "#1e2c4f" }}>Attachments</strong>
              <p style={{ margin: "8px 0 0", color: "#6f7f98", lineHeight: 1.6 }}>
                Each ticket can hold up to 3 image attachments for issue evidence and review.
              </p>
            </div>
            <div style={{ padding: "16px", borderRadius: "18px", background: "#f6f8fd" }}>
              <strong style={{ color: "#1e2c4f" }}>Comment rules</strong>
              <p style={{ margin: "8px 0 0", color: "#6f7f98", lineHeight: 1.6 }}>
                Users and staff can comment, while admin can moderate the whole thread if needed.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );

  const renderBookings = () => (
    <section style={{ ...panel, padding: "28px", minHeight: "620px", display: "grid", placeItems: "center" }}>
      <div style={{ maxWidth: "560px", textAlign: "center" }}>
        <div
          style={{
            width: "88px",
            height: "88px",
            margin: "0 auto 22px",
            borderRadius: "28px",
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(135deg, #4e94ff, #2358c5)",
            color: "#fff",
            fontSize: "2rem",
            boxShadow: "0 18px 36px rgba(55, 125, 255, 0.22)",
          }}
        >
          ◧
        </div>
        <h2 style={{ margin: 0, color: "#1e2c4f", fontSize: "2rem", letterSpacing: "-0.04em" }}>
          Booking module not currently available
        </h2>
        <p style={{ margin: "14px 0 0", color: "#72829c", lineHeight: 1.7 }}>
          The sidebar includes Bookings as requested, but this system does not have booking data yet.
          When booking functionality is added later, this panel can show room bookings, lab reservations,
          and approval actions in the same layout.
        </p>
      </div>
    </section>
  );

  const renderTickets = () => (
    <>
      <section style={{ ...panel, padding: "22px", marginBottom: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div>
            <h2 style={sectionTitle}>Ticket Control Board</h2>
            <p style={{ margin: "6px 0 0", color: "#8a98b1", fontSize: "0.9rem" }}>
              Dynamic admin view for all incident tickets in the system
            </p>
          </div>
          <button
            onClick={() => navigate("/tickets")}
            style={{
              border: "none",
              borderRadius: "999px",
              padding: "11px 18px",
              background: "linear-gradient(135deg, #377dff, #2358c5)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Open Full Ticket Page
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "14px" }}>
          <article style={{ padding: "16px", borderRadius: "18px", background: "#f7faff" }}>
            <div style={{ color: "#7e8da8", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: ".08em" }}>Unassigned</div>
            <div style={{ marginTop: "10px", color: "#1e2c4f", fontSize: "2rem", fontWeight: 800 }}>{unassignedTickets.length}</div>
          </article>
          <article style={{ padding: "16px", borderRadius: "18px", background: "#fff7ef" }}>
            <div style={{ color: "#7e8da8", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: ".08em" }}>Working</div>
            <div style={{ marginTop: "10px", color: "#1e2c4f", fontSize: "2rem", fontWeight: 800 }}>{inProgressTickets.length}</div>
          </article>
          <article style={{ padding: "16px", borderRadius: "18px", background: "#f2fff6" }}>
            <div style={{ color: "#7e8da8", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: ".08em" }}>Resolved</div>
            <div style={{ marginTop: "10px", color: "#1e2c4f", fontSize: "2rem", fontWeight: 800 }}>{resolvedTickets.length}</div>
          </article>
          <article style={{ padding: "16px", borderRadius: "18px", background: "#fff3f4" }}>
            <div style={{ color: "#7e8da8", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: ".08em" }}>Rejected</div>
            <div style={{ marginTop: "10px", color: "#1e2c4f", fontSize: "2rem", fontWeight: 800 }}>{rejectedTickets.length}</div>
          </article>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1.18fr 0.82fr", gap: "18px" }}>
        <section style={{ ...panel, overflow: "hidden" }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid #edf2fb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={sectionTitle}>All Tickets</h2>
            <span style={{ fontSize: "0.82rem", color: "#8a98b1" }}>{tickets.length} records</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#fafcff" }}>
                  {["Ticket", "Status", "Priority", "Assigned", "Action"].map((label) => (
                    <th
                      key={label}
                      style={{
                        padding: "12px 18px",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        color: "#8a98b1",
                        textTransform: "uppercase",
                        letterSpacing: ".08em",
                        borderBottom: "1px solid #edf2fb",
                      }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedTickets.map((ticket) => (
                  <tr key={ticket.id} style={{ borderBottom: "1px solid #f0f4fb" }}>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ color: "#1e2c4f", fontWeight: 700 }}>{ticket.title}</div>
                      <div style={{ color: "#8a98b1", fontSize: "0.82rem", marginTop: "4px" }}>
                        #{ticket.id.slice(-6).toUpperCase()} • {ticket.category}
                      </div>
                    </td>
                    <td style={{ padding: "14px 18px" }}><StatusBadge status={ticket.status} /></td>
                    <td style={{ padding: "14px 18px" }}><PriorityBadge priority={ticket.priority} /></td>
                    <td style={{ padding: "14px 18px", color: ticket.assignedTo ? "#1e2c4f" : "#f08a24", fontWeight: 700 }}>
                      {ticket.assignedTo || "Unassigned"}
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                          onClick={() => navigate(`/tickets/${ticket.id}`)}
                          style={{
                            border: "1px solid #dde5f5",
                            borderRadius: "12px",
                            padding: "8px 12px",
                            background: "#fff",
                            color: "#1e2c4f",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Open
                        </button>
                        <button
                          onClick={() => handleDelete(ticket.id)}
                          disabled={deleting[ticket.id]}
                          style={{
                            border: "none",
                            borderRadius: "12px",
                            padding: "8px 12px",
                            background: deleting[ticket.id] ? "#f5c7cb" : "#d84f5f",
                            color: "#fff",
                            fontWeight: 700,
                            cursor: deleting[ticket.id] ? "not-allowed" : "pointer",
                          }}
                        >
                          {deleting[ticket.id] ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div style={{ display: "grid", gap: "18px" }}>
          <section style={{ ...panel, padding: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={sectionTitle}>Assign Technician</h2>
              <span style={{ color: "#8a98b1", fontSize: "0.82rem" }}>{unassignedTickets.length} pending</span>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              {unassignedTickets.length === 0 && (
                <p style={{ margin: 0, color: "#8a98b1" }}>All open tickets are already assigned.</p>
              )}
              {unassignedTickets.slice(0, 4).map((ticket) => (
                <div key={ticket.id} style={{ padding: "14px", borderRadius: "18px", background: "#f8fbff", border: "1px solid #edf2fb" }}>
                  <div style={{ color: "#1e2c4f", fontWeight: 700, marginBottom: "10px" }}>{ticket.title}</div>
                  <select
                    value={selectedTech[ticket.id] || ""}
                    onChange={(event) =>
                      setSelectedTech((current) => ({ ...current, [ticket.id]: event.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "14px",
                      border: "1px solid #d6e0f0",
                      background: "#fff",
                      color: "#1e2c4f",
                      marginBottom: "10px",
                    }}
                  >
                    <option value="">Select technician</option>
                    {TECHNICIANS.map((technician) => (
                      <option key={technician.id} value={technician.id}>
                        {technician.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleAssign(ticket.id)}
                    disabled={!selectedTech[ticket.id] || assigning[ticket.id]}
                    style={{
                      width: "100%",
                      border: "none",
                      borderRadius: "14px",
                      padding: "10px 12px",
                      background: !selectedTech[ticket.id]
                        ? "#dbe5f2"
                        : "linear-gradient(135deg, #377dff, #2358c5)",
                      color: !selectedTech[ticket.id] ? "#91a0b8" : "#fff",
                      fontWeight: 700,
                      cursor: !selectedTech[ticket.id] ? "not-allowed" : "pointer",
                    }}
                  >
                    {assigning[ticket.id] ? "Assigning..." : "Assign"}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section style={{ ...panel, padding: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={sectionTitle}>Reject Ticket</h2>
              <span style={{ color: "#8a98b1", fontSize: "0.82rem" }}>Admin action</span>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              <select
                value={rejectForm.ticketId}
                onChange={(event) => setRejectForm((current) => ({ ...current, ticketId: event.target.value }))}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "14px",
                  border: "1px solid #d6e0f0",
                  background: "#fff",
                  color: "#1e2c4f",
                }}
              >
                <option value="">Select ticket</option>
                {tickets
                  .filter((ticket) => !["CLOSED", "REJECTED"].includes(ticket.status))
                  .map((ticket) => (
                    <option key={ticket.id} value={ticket.id}>
                      #{ticket.id.slice(-6).toUpperCase()} - {ticket.title}
                    </option>
                  ))}
              </select>
              <textarea
                value={rejectForm.reason}
                onChange={(event) => setRejectForm((current) => ({ ...current, reason: event.target.value }))}
                rows={4}
                placeholder="Enter rejection reason"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "16px",
                  border: "1px solid #d6e0f0",
                  background: "#fff",
                  color: "#1e2c4f",
                  resize: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={handleReject}
                disabled={rejecting}
                style={{
                  border: "none",
                  borderRadius: "14px",
                  padding: "12px 14px",
                  background: "linear-gradient(135deg, #ff8a52, #f05d72)",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: rejecting ? "not-allowed" : "pointer",
                  opacity: rejecting ? 0.75 : 1,
                }}
              >
                {rejecting ? "Rejecting..." : "Reject Ticket"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );

  return (
    <div style={shell}>
      <div style={frame}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "286px minmax(0, 1fr)",
            minHeight: "840px",
          }}
        >
          <aside
            style={{
              padding: "28px 22px",
              background: "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(247,250,255,0.9))",
              borderRight: "1px solid rgba(218, 226, 241, 0.9)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px" }}>
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "16px",
                  display: "grid",
                  placeItems: "center",
                  background: "linear-gradient(135deg, #377dff, #2358c5)",
                  color: "#fff",
                  fontWeight: 800,
                  boxShadow: "0 16px 26px rgba(55, 125, 255, 0.22)",
                }}
              >
                SC
              </div>
              <div>
                <div style={{ color: "#1e2c4f", fontWeight: 800, fontSize: "1.1rem" }}>SmartCampus</div>
                <div style={{ color: "#7b8aa4", fontSize: "0.82rem" }}>Admin Control Center</div>
              </div>
            </div>

            <div style={{ ...panel, padding: "18px", marginBottom: "24px", background: "linear-gradient(180deg, #ffffff, #f8fbff)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "58px",
                    height: "58px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #2d436d, #132644)",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                  }}
                >
                  AD
                </div>
                <div>
                  <div style={{ color: "#1e2c4f", fontWeight: 700 }}>Hello, Admin</div>
                  <div style={{ color: "#8a98b1", fontSize: "0.82rem" }}>System wide access</div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              {SIDEBAR_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  style={sidebarLink(activeSection === item.id)}
                >
                  <span
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "12px",
                      display: "grid",
                      placeItems: "center",
                      background: activeSection === item.id ? "rgba(55, 125, 255, 0.12)" : "#f4f7fc",
                    }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: "28px", padding: "18px", borderRadius: "22px", background: "linear-gradient(135deg, #eef3ff, #f7faff)" }}>
              <div style={{ color: "#1e2c4f", fontWeight: 700, marginBottom: "8px" }}>Admin Scope</div>
              <p style={{ margin: 0, color: "#74839c", lineHeight: 1.6, fontSize: "0.9rem" }}>
                Admin can review all tickets, assign technicians, reject reports, delete tickets, and oversee the full workflow.
              </p>
            </div>

            <div style={{ marginTop: "auto", paddingTop: "24px" }}>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: "18px",
                  padding: "14px 16px",
                  background: "linear-gradient(135deg, #1d2f52, #15233c)",
                  color: "#ffffff",
                  font: "inherit",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 16px 26px rgba(21, 35, 60, 0.18)",
                }}
              >
                Logout
              </button>
            </div>
          </aside>

          <main style={{ padding: "28px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                padding: "10px 0 26px",
              }}
            >
              <div>
                <p style={{ margin: 0, color: "#8a98b1", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 700 }}>
                  Admin Workspace
                </p>
                <h1 style={{ margin: "8px 0 0", color: "#1e2c4f", fontSize: "2rem", letterSpacing: "-0.05em" }}>
                  {activeSection === "dashboard" && "Dashboard"}
                  {activeSection === "bookings" && "Bookings"}
                  {activeSection === "tickets" && "Tickets"}
                </h1>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "999px",
                    background: "#fff",
                    border: "1px solid #edf2fb",
                    color: "#6c7b95",
                  }}
                >
                  Total records: {tickets.length}
                </div>
                <button
                  onClick={refetch}
                  style={{
                    border: "none",
                    borderRadius: "999px",
                    padding: "12px 18px",
                    background: "linear-gradient(135deg, #377dff, #2358c5)",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Refresh Data
                </button>
              </div>
            </div>

            {activeSection === "dashboard" && renderDashboard()}
            {activeSection === "bookings" && renderBookings()}
            {activeSection === "tickets" && renderTickets()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
