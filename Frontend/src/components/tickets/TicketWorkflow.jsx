const STEPS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const TicketWorkflow = ({ currentStatus }) => {
  const isRejected = currentStatus === "REJECTED";
  const currentIndex = STEPS.indexOf(currentStatus);

  if (isRejected) {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
        <span className="text-red-500 text-sm font-medium">✕ Ticket Rejected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${isDone ? "bg-green-500 text-white"
                    : isCurrent ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-gray-100 text-gray-400"}`}
              >
                {isDone ? "✓" : index + 1}
              </div>
              <span className={`text-xs whitespace-nowrap
                ${isDone ? "text-green-600"
                  : isCurrent ? "text-blue-600 font-semibold"
                  : "text-gray-400"}`}>
                {step.replace("_", " ")}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 -mt-5 mx-1 transition-colors
                ${index < currentIndex ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TicketWorkflow;
