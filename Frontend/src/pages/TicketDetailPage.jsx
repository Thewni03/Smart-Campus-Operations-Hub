import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTicketDetail from "../hooks/useTicketDetail";
import useComments from "../hooks/useComments";
import { useAuth } from "../context/AuthContext";
import TicketWorkflow from "../components/tickets/TicketWorkflow";
import { StatusBadge, PriorityBadge } from "../components/tickets/TicketStatusBadge";
import CommentList from "../components/comments/CommentList";
import CommentForm from "../components/comments/CommentForm";
import AttachmentUpload from "../components/attachments/AttachmentUpload";
import AttachmentGrid from "../components/attachments/AttachmentGrid";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatDateTime } from "../utils/formatDate";
import { TICKET_STATUS } from "../utils/constants";

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isTechnician } = useAuth();
  const { ticket, loading, error, changeStatus, refetch } = useTicketDetail(id);
  const { comments, loading: commentsLoading, postComment, editComment, removeComment } = useComments(id);

  const [statusForm, setStatusForm] = useState({ status: "", rejectionReason: "", resolutionNotes: "" });
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [attachments, setAttachments] = useState(ticket?.attachments || []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!ticket) return null;

  const handleStatusUpdate = async () => {
    if (!statusForm.status) return;
    try {
      setUpdatingStatus(true);
      await changeStatus(statusForm);
      setStatusForm({ status: "", rejectionReason: "", resolutionNotes: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const canUpdateStatus = isAdmin() || (isTechnician() && ticket.assignedTo === user?.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back + Header */}
      <button onClick={() => navigate("/tickets")} className="text-sm text-gray-400 hover:text-gray-700 mb-4 flex items-center gap-1">
        ← All Tickets
      </button>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl font-bold text-gray-900">#{id.slice(-6).toUpperCase()}</h1>
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT — main content */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Description card */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{ticket.title}</h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-gray-600 leading-relaxed">{ticket.description}</p>
              {ticket.resolutionNotes && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs font-semibold text-green-700 mb-1">Resolution Notes</p>
                  <p className="text-sm text-green-800">{ticket.resolutionNotes}</p>
                </div>
              )}
              {ticket.rejectionReason && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs font-semibold text-red-700 mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-800">{ticket.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>

          {/* Workflow */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Workflow</h3>
            <TicketWorkflow currentStatus={ticket.status} />
          </div>

          {/* Attachments */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">
                Evidence Photos
                <span className="ml-2 text-xs text-gray-400 font-normal">
                  ({ticket.attachments?.length || 0} / 3)
                </span>
              </h3>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <AttachmentGrid
                ticketId={id}
                attachments={ticket.attachments || []}
                onDeleted={(aid) =>
                  setAttachments((prev) => prev.filter((a) => a.id !== aid))
                }
              />
              <AttachmentUpload
                ticketId={id}
                currentCount={ticket.attachments?.length || 0}
                onUploaded={(att) => setAttachments((prev) => [...prev, att])}
              />
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Comments & Updates</h3>
            </div>
            <div className="p-5">
              <CommentList
                comments={comments}
                loading={commentsLoading}
                onEdit={editComment}
                onDelete={removeComment}
              />
              <CommentForm onSubmit={postComment} />
            </div>
          </div>
        </div>

        {/* RIGHT — sidebar */}
        <div className="flex flex-col gap-4">

          {/* Details */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</h3>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {[
                { label: "Category",    value: ticket.category },
                { label: "Location",    value: ticket.location || "—" },
                { label: "Reported by", value: ticket.reportedBy },
                { label: "Assigned to", value: ticket.assignedTo || <span className="text-red-500">Unassigned</span> },
                { label: "Contact",     value: ticket.contactDetails || "—" },
                { label: "Created",     value: formatDateTime(ticket.createdAt) },
                { label: "Updated",     value: formatDateTime(ticket.updatedAt) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-2">
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className="text-xs font-medium text-gray-700 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status update — admin/technician only */}
          {canUpdateStatus && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Update Status</h3>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm((p) => ({ ...p, status: e.target.value }))}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Move to…</option>
                  {Object.values(TICKET_STATUS)
                    .filter((s) => s !== ticket.status)
                    .map((s) => (
                      <option key={s} value={s}>{s.replace("_", " ")}</option>
                    ))}
                </select>

                <textarea
                  value={statusForm.resolutionNotes}
                  onChange={(e) => setStatusForm((p) => ({ ...p, resolutionNotes: e.target.value }))}
                  placeholder="Resolution notes (required when resolving)…"
                  rows={2}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 resize-none"
                />

                {statusForm.status === "REJECTED" && (
                  <textarea
                    value={statusForm.rejectionReason}
                    onChange={(e) => setStatusForm((p) => ({ ...p, rejectionReason: e.target.value }))}
                    placeholder="Rejection reason (required)…"
                    rows={2}
                    className="w-full text-sm border border-red-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 resize-none"
                  />
                )}

                <button
                  onClick={handleStatusUpdate}
                  disabled={!statusForm.status || updatingStatus}
                  className="w-full bg-blue-600 text-white text-sm py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
                >
                  {updatingStatus ? "Saving…" : "Save Status"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
