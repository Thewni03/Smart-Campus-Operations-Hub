import { statusColors, priorityColors } from "../../utils/statusColors";

export const StatusBadge = ({ status }) => (
  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[status] || "bg-gray-100 text-gray-600"}`}>
    {status?.replace("_", " ")}
  </span>
);

export const PriorityBadge = ({ priority }) => (
  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${priorityColors[priority] || "bg-gray-100 text-gray-600"}`}>
    {priority}
  </span>
);
