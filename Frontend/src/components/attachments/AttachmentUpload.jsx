import { useState, useRef } from "react";
import { uploadAttachment } from "../../api/attachmentApi";

const AttachmentUpload = ({ ticketId, currentCount, onUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const remaining = 3 - currentCount;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const res = await uploadAttachment(ticketId, file);
      onUploaded(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Max 5MB, JPEG/PNG/WEBP only.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (remaining <= 0) {
    return (
      <p className="text-xs text-gray-400 italic">
        Maximum 3 attachments reached.
      </p>
    );
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
      >
        {uploading ? (
          <p className="text-sm text-blue-600">Uploading...</p>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-700">Click to upload photo</p>
            <p className="text-xs text-gray-400 mt-1">
              JPEG · PNG · WEBP · max 5MB &nbsp;·&nbsp; {remaining} slot{remaining > 1 ? "s" : ""} remaining
            </p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default AttachmentUpload;
