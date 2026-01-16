import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { taskAPI } from "../../services/api";
import TaskForm from "../../components/Tasks/TaskForm";

const EditTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Load task on mount
  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTaskById(id);
      setTask(response.data.task);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to load task";
      setError(errorMsg);
      console.error("Load task error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSumbit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Call API
      await taskAPI.updateTask(id, formData);

      // Show success message
      setSuccessMsg("✅ Task updated successfully!");

      // Wait 1 second then redirect
      setTimeout(() => {
        navigate("/tasks");
      }, 1000);
    } catch (error) {
      const errorMsg = err.response?.data?.error || "Failed to update task";
      setError(errorMsg);
      console.error("Update task error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loader
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-4">
          {error}
        </div>
        <button
          onClick={loadTask}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">✏️ Edit Task</h1>
        <p className="text-gray-600 mt-2">Update the task details below</p>
      </div>
      {successMsg && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg">
          {successMsg}
        </div>
      )}

      {task && (
        <TaskForm
          initialData={task}
          onSubmit={handleSumbit}
          isLoading={isSubmitting}
          error={error}
        />
      )}
    </div>
  );
};

export default EditTask;
