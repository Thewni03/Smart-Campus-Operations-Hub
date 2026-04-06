import CommentItem from "./CommentItem";
import LoadingSpinner from "../common/LoadingSpinner";

const CommentList = ({ comments, loading, onEdit, onDelete }) => {
  if (loading) return <LoadingSpinner message="Loading comments..." />;

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No comments yet. Be the first to add an update.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CommentList;
