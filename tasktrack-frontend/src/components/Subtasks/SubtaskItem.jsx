import React, { useState } from "react";
import { taskAPI } from "../../services/api";

const SubtaskItem = ({ subtask, taskId, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtask.title);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

      if (response.subtask) {
        onToggle(subtask._id, newCompletedStatus);
      }
    } catch (err) {
      alert("Failed to update: " + (err.response?.data?.error || err.message));
      console.error("Toggle subtask error:", err);
    }
  };

  // Handle save edit
  const handleSave = async () => {
    if (!editTitle.trim()) {
      alert("Subtask title required");
    }

    if (editTitle === subtask.title) {
      //No change, just cancel
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);

      const response = await taskAPI.updateSubtask(
        taskId,
        subtask._id,
        editTitle,
      );

      // Backend returns : {message , subtask}
      if (response.subtask) {
        onEdit(subtask._id, response.subtask, title);
        setIsEditing(false);
      }
    } catch (error) {
      alert("Failed to save: " + (err.response?.data?.error || err.message));
      setEditTitle(subtask.title);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm("Delete this subtask?")) return;
    try {
      setIsDeleting(true);
      const response = await taskAPI.deleteSubtask(taskId, subtask._id);

      // Backend returns {message, counts}
      if (response) {
        onDelete(subtask._id);
      }
    } catch (error) {
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
        disabled={isDeleting}
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
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 disabled:text-red-300 text-sm font-medium transition"
            title="Delete"
          >
            🗑️
          </button>
        </>
      )}
    </div>
  );
};

export default SubtaskItem;
