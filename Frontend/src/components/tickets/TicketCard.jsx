import { useNavigate } from "react-router-dom";
import { StatusBadge, PriorityBadge } from "./TicketStatusBadge";
import { priorityBorder } from "../../utils/statusColors";
import { timeAgo } from "../../utils/formatDate";

const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      className={`bg-white border border-gray-200 border-l-4 ${priorityBorder[ticket.priority]} rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="text-xs text-gray-400 mb-1">#{ticket.id?.slice(-6).toUpperCase()}</p>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug">
            {ticket.title}
          </h3>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <PriorityBadge priority={ticket.priority} />
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          {ticket.category}
        </span>
        {ticket.attachmentCount > 0 && (
          <span className="text-xs text-gray-400">📎 {ticket.attachmentCount}</span>
        )}
        <span className="text-xs text-gray-400 ml-auto">{timeAgo(ticket.createdAt)}</span>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        {ticket.assignedTo ? `Assigned: ${ticket.assignedTo}` : "Unassigned"}
      </div>
    </div>
  );
};

export default TicketCard;
