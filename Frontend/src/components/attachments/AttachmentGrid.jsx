import { useState } from "react";
import { deleteAttachment } from "../../api/attachmentApi";
import { useAuth } from "../../context/AuthContext";

const AttachmentGrid = ({ ticketId, attachments, onDeleted }) => {
  const { isAdmin } = useAuth();
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (attachmentId) => {
    if (!window.confirm("Delete this attachment?")) return;
    try {
      setDeleting(attachmentId);
      await deleteAttachment(ticketId, attachmentId);
      onDeleted(attachmentId);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleting(null);
    }
  };

  if (!attachments || attachments.length === 0) {
    return <p className="text-sm text-gray-400 italic">No photos attached.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {attachments.map((att) => (
        <div
          key={att.id}
          className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
        >
          <img
            src={att.fileUrl}
            alt={att.fileName || "Attachment"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          {/* Fallback if image fails */}
          <div className="hidden w-full h-full items-center justify-center flex-col gap-1">
            <span className="text-2xl">🖼️</span>
            <span className="text-xs text-gray-400 text-center px-1 truncate w-full">
              {att.fileName}
            </span>
          </div>

          {/* Delete button on hover */}
          <button
            onClick={() => handleDelete(att.id)}
            disabled={deleting === att.id}
            className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs items-center justify-center hidden group-hover:flex hover:bg-red-700 transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default AttachmentGrid;
