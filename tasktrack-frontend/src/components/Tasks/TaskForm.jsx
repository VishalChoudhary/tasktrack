import React, { useEffect, useState } from "react";

const TaskForm = ({
  initialData = null,
  onSubmit,
  isLoading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });

  const [validationError, setValidationError] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError("");
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setValidationError("Title is required");
      return false;
    }
    if (formData.title.trim().length < 3) {
      setValidationError("Title must be at least 3 characters");
      return false;
    }
    if (formData.description && formData.description.length > 500) {
      setValidationError("Description must be less than 500 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-8 max-w-2xl"
    >
      {/* Title Field */}
      <div className="mb-6">
        <label
          htmlFor="title"
          className="block text-sm font-medium' text-gray-700 mb-2"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <p className="mt-1 text-xs text-gray-500">Min 3 characters</p>
      </div>

      {/* Description Field */}
      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p className="mt-1 px-4 text-xs text-gray-500">Max 500 characters</p>
      </div>

      {/* Status Field */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
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
        <label className="block text-sm font-medium text-gray-700 mb-3">
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
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {validationError}
        </div>
      )}

      {/* API Error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
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
