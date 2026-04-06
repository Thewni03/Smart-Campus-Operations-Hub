import { useState } from "react";

const CommentForm = ({ onSubmit }) => {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      setSubmitting(true);
      await onSubmit(content.trim());
      setContent("");
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 pt-4 border-t border-gray-200">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment or update..."
        className="flex-1 text-sm border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        disabled={submitting}
      />
      <button
        type="submit"
        disabled={!content.trim() || submitting}
        className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default CommentForm;
