import React, { useState } from "react";
import { taskAPI } from "../../services/api";

const SubtaskItem = ({ subtask, taskId, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtask.title);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSubtaskModal, setDeleteSubtaskModal] = useState(false);

  // Handle toggle completion
  const handleToggle = async () => {
    try {
      // Send opposite of current state
      const newCompletedStatus = !subtask.completed;

      const response = await taskAPI.toggleSubtask(
        taskId,
        subtask._id,
        newCompletedStatus,
      );

      if (response.data.subtask) {
        onToggle(subtask._id, newCompletedStatus);
      }
    } catch (err) {
      // REVERT on error
      console.error("Error, reverting...");
      onToggle(subtask._id, subtask.completed);
      alert("Failed to update: " + (err.response?.data?.error || err.message));
    }
  };

  // // Handle save edit (Optimistic Update)
  const handleSave = async () => {
    const trimmedTitle = editTitle.trim();

    // Validation
    if (!trimmedTitle) {
      alert("Subtask title is required");
      return;
    }

    if (trimmedTitle === subtask.title) {
      // No change, just close
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);

      // Updating parent state immediately
      onEdit(subtask._id, trimmedTitle);

      // Closing edit mode immediately
      setIsEditing(false);

      // Sending API call in background
      const response = await taskAPI.updateSubtask(
        taskId,
        subtask._id,
        trimmedTitle,
      );

      // Check resposnse data
      if (!response.data?.subtask) {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      // REVERT on error
      console.error("Error, reverting...");
      onEdit(subtask._id, subtask.title);
      setIsEditing(true);
      alert(
        "Failed to save: " + (error.response?.data?.error || error.message),
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (isDeleting) return false;
    try {
      setIsDeleting(true);
      const response = await taskAPI.deleteSubtask(taskId, subtask._id);

      // Backend returns {message, counts}
      if (response) {
        onDelete(subtask._id);
      }
    } catch (err) {
      alert("Failed to delete: " + (err.response?.data?.error || err.message));
      console.error("Delete subtask error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={subtask.completed || false}
        onChange={handleToggle}
        className="w-5 h-5 text-indigo-600 cursor-pointer flex-shrink-0"
        title="Mark as complete"
        disabled={isDeleting || isEditing}
      />

      {/* Title - Editable */}
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500"
          autoFocus
          maxLength="100"
          disabled={isSaving}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setEditTitle(subtask.title);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <span
          className={`flex-1 text-sm cursor-pointer select-none transition ${
            subtask.completed
              ? "line-through text-gray-400"
              : "text-gray-800 hover:text-gray-600"
          }`}
          onClick={() => setIsEditing(true)}
          title="Click to Edit"
        >
          {subtask.title}
        </span>
      )}

      {/* Action Buttons */}
      {isEditing ? (
        <>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="text-green-600 hover:text-green-700 disabled:text-green-300 text-sm font-medium transition"
            title="Save"
          >
            ✓
          </button>
          <button
            onClick={() => {
              setEditTitle(subtask.title);
              setIsEditing(false);
            }}
            className="text-gray-600 hover:text-gray-700 text-sm font-medium transition"
            title="Cancel"
          >
            ✕
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => setIsEditing(true)}
            disabled={isDeleting}
            className="text-indigo-600 hover:text-indigo-700 disabled:text-indigo-300 text-sm font-medium transition"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setDeleteSubtaskModal(true);
            }}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 disabled:text-red-300 text-sm font-medium transition"
            title="Delete"
          >
            🗑️
          </button>
        </>
      )}
      {/* Subtask Delete Modal */}
      {deleteSubtaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Subtask?
            </h3>

            <p className="text-gray-600 mb-6 text-sm">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  const success = await handleDelete();
                  if (success) setDeleteSubtaskModal(false);
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteSubtaskModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubtaskItem;
