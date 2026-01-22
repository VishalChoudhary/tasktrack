import React, { useState } from "react";
import { taskAPI } from "../../services/api";
import DeleteConfirmModal from "./DeleteConfirmModal";
import SubtaskForm from "../Subtasks/SubtaskForm";
import SubtaskList from "../Subtasks/SubtaskList";

const TaskCard = ({ task, onTaskDeleted }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [expandSubtasks, setExpandSubtasks] = useState(false);
  const [subtaskCounts, setSubtaskCounts] = useState(() => ({
    total:
      (task &&
        (task.subtasksTotal ?? (task.subtasks ? task.subtasks.length : 0))) ||
      0,
    completed: (task && (task.subtasksCompleted ?? 0)) || 0,
  }));

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

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      // Call API to delete
      await taskAPI.deleteTask(task._id || task.id);

      // Call parent callback to remove from list (Immediately remove from UI)
      if (onTaskDeleted) {
        onTaskDeleted(task._id || task.id);
      }
      // Close modal
      setShowDeleteModal(false);
    } catch (err) {
      alert(
        "Failed to delete task: ",
        +(err.response?.data?.error || err.message),
      );
      console.error("Delete error: ", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Subtask created
  const handleSubtaskCreated = async (newSubtask) => {
    try {
      const response = await taskAPI.getSubTasks(task._id || task.id);
      const latestSubtasks = response.data.subtasks || [];
      setSubtasks(latestSubtasks);

      // Take counts from updated subtasks
      const completed = latestSubtasks.filter((s) => s.completed).length;
      setSubtaskCounts({
        total: latestSubtasks.length,
        completed,
      });
    } catch (err) {
      // fallback: optimistic update
      const updatedSubtasks = [newSubtask, ...subtasks];
      setSubtasks(updatedSubtasks);

      const completed = updatedSubtasks.filter((s) => s.completed).length;

      setSubtaskCounts({
        total: updatedSubtasks.length,
        completed,
      });
    }
    setShowSubtaskForm(false);
    setExpandSubtasks(true); // Ensure subtasks section is visible after adding
  };

  // Handle subtask toggled
  const handleSubtaskToggle = (subtaskId, completed) => {
    setSubtasks(
      subtasks.map((s) => (s._id === subtaskId ? { ...s, completed } : s)),
    );
    // Update counts based on new completion status
    const newCompleted = subtasks.filter((s) =>
      s._id === subtaskId ? completed : s.completed,
    ).length;
    setSubtaskCounts({
      total: subtasks.length,
      completed: newCompleted,
    });
  };

  // Handle subtask deleted
  const handleSubtaskDelete = (subtaskId) => {
    const newSubtasks = subtasks.filter((s) => s._id !== subtaskId);
    setSubtasks(newSubtasks);
    // Recalculate counts
    const newCompleted = newSubtasks.filter((s) => s.completed).length;
    setSubtaskCounts({
      total: newSubtasks.length,
      completed: newCompleted,
    });
  };

  // Handle subtask edited
  const handleSubtaskEdit = (subtaskId, newTitle) => {
    // Create new array
    const updatedSubtasks = subtasks.map((s) =>
      s._id === subtaskId ? { ...s, title: newTitle } : s,
    );

    // Update state
    setSubtasks(updatedSubtasks);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {task.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
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

          {/* Subtask Count Badge */}
          {subtaskCounts && subtaskCounts.total > 0 && (
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
              📋 {subtaskCounts.completed}/{subtaskCounts.total}
            </span>
          )}
        </div>

        {/* Footer: Date + Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
          <span className="text-xs text-gray-500">
            📅 {formatDate(task.dueDate)}
          </span>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Subtasks Button */}
            <button
              onClick={async () => {
                if (!expandSubtasks) {
                  // Fetch latest subtasks from backend when expanding
                  try {
                    const response = await taskAPI.getSubTasks(
                      task._id || task.id,
                    );
                    setSubtasks(response.data.subtasks || []);
                  } catch (err) {
                    // fallback: keep current subtasks
                  }
                }
                setExpandSubtasks(!expandSubtasks);
              }}
              className={`text-sm font-medium transition ${
                expandSubtasks
                  ? "text-purple-700 bg-purple-50 px-2 py-1 rounded"
                  : "text-purple-600 hover:text-purple-700"
              }`}
              title="View subtasks"
            >
              📋 Subtasks
            </button>

            {/* Edit Button */}
            <a
              href={`/tasks/${task._id || task.id}/edit`}
              className="text-indigo-500 hover:text-indigo-700 text-sm font-medium transition"
              title="Edit task"
            >
              ✏️ Edit
            </a>

            {/* Delete Button */}
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 disabled:text-red-300 text-sm font-medium transition"
              title="Delete task"
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Subtasks Section - Expandable */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            expandSubtasks
              ? "max-h-[1000px] opacity-100 mt-5 pt-5"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-gray-200">
            {/* Add Subtask Form */}
            {showSubtaskForm ? (
              <SubtaskForm
                taskId={task._id || task.id}
                onSubtaskCreated={handleSubtaskCreated}
                onCancel={() => setShowSubtaskForm(false)}
              />
            ) : (
              <button
                onClick={() => setShowSubtaskForm(true)}
                className="w-full mb-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg transition text-sm font-medium"
              >
                ➕ Add Subtask
              </button>
            )}

            {/* Subtasks List */}
            {subtasks.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm">
                📭 No subtasks yet. Add one to get started!
              </div>
            ) : (
              <div className="max-h-[210px] overflow-y-auto pr-1 scroll-smooth">
                <SubtaskList
                  subtasks={subtasks}
                  taskId={task._id || task.id}
                  onToggle={handleSubtaskToggle}
                  onDelete={handleSubtaskDelete}
                  onEdit={handleSubtaskEdit}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          taskTitle={task.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
          isLoading={isDeleting}
        />
      )}
    </>
  );
};

export default TaskCard;
