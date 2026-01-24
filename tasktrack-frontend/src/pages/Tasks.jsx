import React, { useEffect, useState } from "react";
import { taskAPI } from "../services/api";
import TaskList from "../components/Tasks/TaskList";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  // PAGINATION STATE - SIMPLE
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  // Fetch tasks when page or filter changes
  useEffect(() => {
    fetchTasks();
  }, [currentPage, filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build params
      const params = {
        page: currentPage,
        limit: 9, // 9 tasks per page
      };

      if (filter !== "all") {
        params.status = filter;
      }

      // Call API
      const response = await taskAPI.getTasks(params);

      setTasks(response.data.tasks || []);
      setTotalPages(response.data.pagination.totalPages);
      setTotalTasks(response.data.pagination.total);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to load tasks";
      setError(errorMsg);
      console.log("Tasks error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskDeleted = (deleteId) => {
    // Remove task from UI
    const updatedTasks = tasks.filter(
      (t) => t._id !== deleteId && t.id !== deleteId,
    );
    setTasks(updatedTasks);

    // If last task deleted → go to previous page
    if (updatedTasks.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    fetchTasks();
  };

  const handleFilterChange = (status) => {
    setFilter(status);
    setCurrentPage(1); // Reset to page 1
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  //Error State
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 h-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-medium mb-2">⚠️ Error</p>
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchTasks}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          📋 My Tasks
        </h1>

        <div className="flex items-center justify-between gap-4 mb-2">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {["all", "todo", "in-progress", "done"].map((status) => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
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
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
          >
            ➕ Create New Task
          </a>
        </div>
      </div>

      {/* Task Info */}
      {tasks.length > 0 && (
        <div className="mb-6 text-gray-700 dark:text-gray-300">
          <p>
            {filter !== "all" && (
              <span>
                Showing <strong>{tasks.length}</strong> tasks
              </span>
            )}
          </p>
        </div>
      )}

      {/* Task List */}
      {tasks.length > 0 ? (
        <div className=" flex flex-col flex-1">
          <TaskList tasks={tasks} onDelete={handleTaskDeleted} />

          {/* PAGINATION FOOTER */}
          <div className="mt-auto pt-8">
            {/* SIMPLE PAGINATION */}
            <div className="flex items-center justify-center gap-4">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                ← Prev
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg transition ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Next →
              </button>
            </div>

            {/* Page Info */}
            <div className="text-center mt-4 text-gray-600 dark:text-gray-200 text-sm">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            No tasks found
          </h3>
          <a
            href="/tasks/create"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded transition"
          >
            ➕ Create First Task
          </a>
        </div>
      )}
    </div>
  );
};

export default Tasks;
