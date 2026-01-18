import React from "react";
import SubtaskItem from "./SubtaskItem";

const SubtaskList = ({ subtasks, taskId, onToggle, onDelete, onEdit }) => {
  if (!Array.isArray(subtasks) || subtasks.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-sm">
        📭 No subtasks yet. Add one to get started!
      </div>
    );
  }

  // Filter out any undefined/null subtasks to avoid errors
  const safeSubtasks = subtasks.filter((s) => s && typeof s === "object");
  const completedCount = safeSubtasks.filter((s) => s.completed).length;
  const percentage =
    safeSubtasks.length > 0
      ? Math.round((completedCount / safeSubtasks.length) * 100)
      : 0;

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-700">
            Progress: {completedCount} of {subtasks.length}
          </span>
          <span className="text-xs text-gray-500">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Subtask Items */}
      <div>
        {safeSubtasks.map((subtask) => (
          <SubtaskItem
            key={subtask._id}
            subtask={subtask}
            taskId={taskId}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default SubtaskList;
