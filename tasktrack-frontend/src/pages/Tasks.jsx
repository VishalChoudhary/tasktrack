import React, { use, useEffect, useState } from "react";
import { taskAPI } from "../services/api";
import TaskList from "../components/Tasks/TaskList";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); //all, todo, in-progress,done

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params based on filter
      const params = filter !== "all" ? { status: filter } : {};

      // Call API
      const response = await taskAPI.getTasks(params);
      setTasks(response.data.tasks || []);
    } catch (err) {
      const errorMsg = error.response?.data?.error || "Failed to load tasks";
      setError(errorMsg);
      console.log("Tasks error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskDeleted = (deleteId) => {
    console.log("Deleting task: ", deleteId);
    setTasks((prevTasks) =>
      prevTasks.filter((t) => t._id !== deleteId && t.id !== deleteId),
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">📋 My Tasks</h1>
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {["all", "todo", "in-progress", "done"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status === "all"
                ? "🗂️ All"
                : status === "todo"
                  ? "📝 To Do"
                  : status === "in-progress"
                    ? "🔄 In Progress"
                    : "🎯 Done"}
            </button>
          ))}
        </div>
        {/* Create Task Button */}
        <a
          href="/tasks/create"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 mt-2 rounded-lg transition mb-6"
        >
          ➕ Create New Task
        </a>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
          <p className="font-medium mb-2">⚠️ Error</p>
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchTasks}
            className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Task Count Info */}
      {tasks.length > 0 && (
        <div className="mb-6 text-gray-600">
          Showing <strong>{tasks.length}</strong> task
          {tasks.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Task List */}
      <TaskList tasks={tasks} onDelete={handleTaskDeleted} />
    </div>
  );
};

export default Tasks;
