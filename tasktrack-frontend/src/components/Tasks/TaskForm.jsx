import React, { useEffect, useState } from "react";

const TaskForm = ({ initialData = null, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });

  const [formError, setFormError] = useState("");
  const TITLE_MAX = 100;
  const DESC_MAX = 500;

  //Pre-fill form if editing
  useEffect(() => {
    if (initialData) {
      let dueDate = "";
      if (initialData.dueDate) {
        // Convert to yyyy-MM-dd format for input type=date
        const dateObj = new Date(initialData.dueDate);
        if (!isNaN(dateObj.getTime())) {
          dueDate = dateObj.toISOString().slice(0, 10);
        }
      }
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "",
        priority: initialData.priority || "",
        dueDate,
      });
    }
  }, [initialData]);

  useEffect(() => {
    // Only for CREATE (no initialData)
    if (!initialData) {
      const today = new Date().toISOString().slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        dueDate: today,
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError("");
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setFormError("Title is required");
      return false;
    }

    if (formData.title.trim().length < 3) {
      setFormError("Title must be at least 3 characters");
      return false;
    }

    if (formData.title.length > TITLE_MAX) {
      setFormError("Title cannot exceed 100 characters");
      return false;
    }

    if (formData.description && formData.description.length > DESC_MAX) {
      setFormError("Description must be less than 500 characters");
      return false;
    }

    if (!formData.dueDate) {
      setFormError("Due date is required");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      onSubmit(formData);
    } catch (err) {
      setFormError(err?.message || "Failed to create task");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-8 max-w-2xl dark:bg-gradient-to-br dark:from-slate-950/80 dark:to-slate-900    dark:border dark:border-white/10 "
    >
      {/* Title Field */}
      <div className="mb-6">
        <label
          htmlFor="title"
          className="block text-sm font-medium' text-gray-700 dark:text-gray-200 mb-2"
        >
          Task Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          maxLength={TITLE_MAX}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-300 flex justify-between">
          <span>Min 3 characters</span>
          <span>
            {formData.title.length}/{TITLE_MAX}
          </span>
        </p>
      </div>

      {/* Description Field */}
      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows={4}
          maxLength={DESC_MAX}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500
        dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 resize-none overflow-y-auto"
        />
        <p className="mt-1 px-4 text-xs text-gray-500 dark:text-gray-300">
          Max 500 characters
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-300 text-right">
          {formData.description.length}/{DESC_MAX}
        </p>
      </div>

      {/* Status Field */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
          Status *
        </label>
        <div className="flex gap-4">
          {["todo", "in-progress", "done"].map((status) => (
            <label key={status} className="flex items-center">
              <input
                type="radio"
                name="status"
                value={status}
                checked={formData.status === status}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm">
                {status === "todo"
                  ? "📝 To Do"
                  : status === "in-progress"
                    ? "🔄 In Progress"
                    : "🎯 Done"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Priority Field */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
          Priority *
        </label>
        <div className="flex gap-4">
          {["low", "medium", "high"].map((priority) => (
            <label key={priority} className="flex items-center">
              <input
                type="radio"
                name="priority"
                value={priority}
                checked={formData.priority === priority}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm">
                {priority === "high"
                  ? "🔴 High"
                  : priority === "medium"
                    ? "🟡 Medium"
                    : "🔵 Low"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Due Date Field */}
      <div className="mb-6">
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
        >
          Due Date (default: today)
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 "
        />
      </div>

      {/* Error & Validation */}
      {formError && (
        <div className="mb-6 text-center bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {formError}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          {isLoading && <span className="animate-spin">⏳</span>}
          {initialData ? "Update Task" : "Create Task"}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
