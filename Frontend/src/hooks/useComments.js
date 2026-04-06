import { useState, useEffect } from "react";
import {
  getComments, addComment, updateComment, deleteComment,
} from "../api/commentApi";

const useComments = (ticketId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await getComments(ticketId);
      setComments(res.data.data || []);
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoading(false);
    }
  };

  const postComment = async (content) => {
    const res = await addComment(ticketId, { content });
    setComments((prev) => [...prev, res.data.data]);
  };

  const editComment = async (commentId, content) => {
    const res = await updateComment(ticketId, commentId, { content });
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? res.data.data : c))
    );
  };

  const removeComment = async (commentId) => {
    await deleteComment(ticketId, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  useEffect(() => { if (ticketId) fetchComments(); }, [ticketId]);

  return { comments, loading, postComment, editComment, removeComment };
};

export default useComments;
