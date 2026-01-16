import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { taskAPI } from "../../services/api";
import TaskForm from "../../components/Tasks/TaskForm";

const CreateTask = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call API
      const response = await taskAPI.createTask(formData);

      // Show success Message
      setSuccessMsg("✔️ Task Created Successfully");

      // Wait 1 sec then redirect
      setTimeout(() => {
        navigate("/tasks");
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to create task";
      setError(errorMsg);
      console.error("Create task error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">➕ Create New Task</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to create a new task
        </p>
      </div>
      {successMsg && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg">
          {successMsg}
        </div>
      )}

      <TaskForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
    </div>
  );
};

export default CreateTask;
