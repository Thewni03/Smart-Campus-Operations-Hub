import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { formatDateTime } from "../../utils/formatDate";

const roleColors = {
  ADMIN:      "bg-gray-800 text-white",
  TECHNICIAN: "bg-amber-500 text-white",
  USER:       "bg-blue-600 text-white",
};

const CommentItem = ({ comment, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const isOwner = user?.id === comment.authorId || user?.email === comment.authorId;

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(comment.id, editText.trim());
      setEditing(false);
    }
  };

  return (
    <div className="flex gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${roleColors[comment.authorRole] || "bg-gray-400 text-white"}`}>
        {comment.authorName?.slice(0, 2).toUpperCase() || "??"}
      </div>

      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-900">{comment.authorName}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${roleColors[comment.authorRole]}`}>
            {comment.authorRole}
          </span>
          <span className="text-xs text-gray-400 ml-auto">{formatDateTime(comment.createdAt)}</span>
          {comment.updatedAt && (
            <span className="text-xs text-gray-400 italic">(edited)</span>
          )}
        </div>

        {editing ? (
          <div className="flex gap-2">
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
            />
            <button onClick={handleSave} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">Save</button>
            <button onClick={() => setEditing(false)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 leading-relaxed">
            {comment.content}
          </div>
        )}

        {isOwner && !editing && (
          <div className="flex gap-3 mt-1">
            <button onClick={() => setEditing(true)} className="text-xs text-gray-400 hover:text-blue-600 transition-colors">Edit</button>
            <button onClick={() => onDelete(comment.id)} className="text-xs text-gray-400 hover:text-red-600 transition-colors">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
