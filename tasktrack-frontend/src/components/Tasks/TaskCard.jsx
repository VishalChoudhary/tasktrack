import React from "react";

const TaskCard = ({ task }) => {
  // Formatting date
  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Status badge styling
  const getStatusColor = () => {
    switch (task.status) {
      case "done":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "todo":
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  // Priority badge styling
  const getPriorityColor = () => {
    switch (task.priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  // Status display text
  const getStatusText = () => {
    switch (task.status) {
      case "done":
        return "✅ Done";
      case "in-progress":
        return "⏳ In Progress";
      case "todo":
      default:
        return "✓ To Do";
    }
  };

  // Priority display text
  const getPriorityText = () => {
    switch (task.priority) {
      case "high":
        return "🔴 High";
      case "medium":
        return "🟡 Medium";
      case "low":
      default:
        return "🔵 Low";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
        {task.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {task.description || "No description"}
      </p>

      {/* Badges Row */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Status Badge */}
        <span
          className={`${getStatusColor()} px-3 py-1 rounded-full text-xs font-medium`}
        >
          {getStatusText()}
        </span>

        {/* Priority Badge */}
        <span
          className={`${getPriorityColor()} px-3 py-1 rounded-full text-xs font-medium`}
        >
          {getPriorityText()}
        </span>
      </div>

      {/* Footer: Date + Delete Button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          📅 {formatDate(task.dueDate)}
        </span>

        {/* Edit & Delete Buttons */}
        <div className="flex gap-2">
          <a
            href={`/tasks/${task._id || task.id}/edit`}
            className="text-indigo-500 hover:text-indigo-700 text-sm font-medium transition"
            title="Edit task"
          >
            ✏️ Edit
          </a>
          <button
            onClick={() => {
              if (window.confirm(`Delete "${task.title}"?`)) {
                // TODO: Call delete API
              }
            }}
            className="text-red-500 hover:text-red-700 text-sm font-medium transition"
            title="Delete task"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
