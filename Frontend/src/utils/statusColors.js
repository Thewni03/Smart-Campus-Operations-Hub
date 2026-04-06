// Tailwind badge classes for ticket status
export const statusColors = {
    OPEN:        "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-amber-100 text-amber-800",
    RESOLVED:    "bg-green-100 text-green-800",
    CLOSED:      "bg-gray-100 text-gray-600",
    REJECTED:    "bg-red-100 text-red-700",
  };
  
  // Tailwind badge classes for priority
  export const priorityColors = {
    LOW:      "bg-green-100 text-green-700",
    MEDIUM:   "bg-blue-100 text-blue-700",
    HIGH:     "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
  };
  
  // Left border accent colors for ticket cards
  export const priorityBorder = {
    LOW:      "border-l-green-400",
    MEDIUM:   "border-l-blue-400",
    HIGH:     "border-l-orange-400",
    CRITICAL: "border-l-red-500",
  };
  