import { useNavigate } from "react-router-dom";
import { StatusBadge, PriorityBadge } from "./TicketStatusBadge";
import { timeAgo } from "../../utils/formatDate";

const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();
  const accent =
    ticket.priority === "CRITICAL"
      ? "linear-gradient(135deg, #d84f5f, #b93349)"
      : ticket.priority === "HIGH"
        ? "linear-gradient(135deg, #f08a24, #d76a17)"
        : ticket.priority === "MEDIUM"
          ? "linear-gradient(135deg, #f3c56c, #d8a54a)"
          : "linear-gradient(135deg, #4fb28e, #2d8e70)";

  return (
    <div
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      style={{
        cursor: "pointer",
        borderRadius: "24px",
        background: "rgba(255,255,255,0.88)",
        border: "1px solid rgba(23,48,66,0.08)",
        boxShadow: "0 18px 36px rgba(23,48,66,0.08)",
        overflow: "hidden",
        transition: "transform .18s ease, box-shadow .18s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 22px 42px rgba(23,48,66,0.12)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 18px 36px rgba(23,48,66,0.08)";
      }}
    >
      <div style={{ height: "8px", background: accent }} />
      <div style={{ padding: "18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
          <div>
            <p style={{ margin: "0 0 6px", fontSize: ".73rem", color: "#8b9ab1", fontWeight: 700, letterSpacing: ".08em" }}>
              #{ticket.id?.slice(-6).toUpperCase()}
            </p>
            <h3 style={{ margin: 0, fontSize: ".98rem", fontWeight: 700, color: "#173042", lineHeight: 1.35 }}>
              {ticket.title}
            </h3>
          </div>
          <StatusBadge status={ticket.status} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
          <PriorityBadge priority={ticket.priority} />
          <span style={{ fontSize: ".74rem", padding: "5px 10px", borderRadius: "999px", background: "#f3f6f9", color: "#637886", fontWeight: 600 }}>
            {ticket.category}
          </span>
          {ticket.attachmentCount > 0 && (
            <span style={{ fontSize: ".74rem", color: "#7a8f9e", fontWeight: 600 }}>
              {ticket.attachmentCount} attachment{ticket.attachmentCount > 1 ? "s" : ""}
            </span>
          )}
          <span style={{ marginLeft: "auto", fontSize: ".74rem", color: "#8b9ab1" }}>{timeAgo(ticket.createdAt)}</span>
        </div>

        <div style={{ padding: "12px 14px", borderRadius: "18px", background: "rgba(244,241,234,.7)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontSize: ".8rem" }}>
            <span style={{ color: "#7a8f9e" }}>Assigned</span>
            <strong style={{ color: (ticket.assignedTechnicianId || ticket.assignedTo) ? "#173042" : "#d47a0c" }}>
              {ticket.assignedTechnicianName || ticket.assignedTechnicianId || ticket.assignedTo || "Unassigned"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
