import React, { useState } from "react";
import { taskAPI } from "../../services/api";

const SubtaskForm = ({ taskId, onSubtaskCreated, onCancel }) => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    //Validation
    if (!title.trim()) {
      setError("Subtask title is required");
      return;
    }

    try {
      setIsLoading(true);

      // Call backend API
      const response = await taskAPI.addSubtask(taskId, {
        title: title.trim(),
      });

      // Backend response: { message, subtask, counts }
      if (response.subtask) {
        // Reset form
        setTitle("");
      }

      // Call parent callback with new subtask
      onSubtaskCreated(response.subtask);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to create subtask");
      console.error("Create subtask error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        ➕ Add Subtask
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtask Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter subtask title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            maxLength="100"
            autoFocus
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
            ❌ {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg transition font-medium"
          >
            {isLoading ? "Creating..." : "✓ Add Subtask"}
          </button>
          <button
            type="submit"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition font-medium disabled:opacity-50"
          >
            ✕ Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubtaskForm;
