import React, { useEffect, useState } from "react";
import { taskAPI } from "../services/api";
import TaskList from "../components/Tasks/TaskList";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  // DEFINE TABS CONFIGURATION
  const tabs = [
    {
      id: "all",
      label: "All Tasks",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
    },
    {
      id: "todo",
      label: "To Do",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      id: "in-progress", // MATCHES YOUR API STRING
      label: "In Progress",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2v4" />
          <path d="m16.2 7.8 2.9-2.9" />
          <path d="M18 12h4" />
          <path d="m16.2 16.2 2.9 2.9" />
          <path d="M12 18v4" />
          <path d="m4.9 19.1 2.9-2.9" />
          <path d="M2 12h4" />
          <path d="m4.9 4.9 2.9 2.9" />
        </svg>
      ),
    },
    {
      id: "done",
      label: "Completed",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ];

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
        {/* Top Row: Title & Create Button */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <svg
                className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="3" y="3" width="7" height="7" rx="2" opacity="0.5" />
                <rect x="14" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" opacity="0.5" />
                <rect x="3" y="14" width="7" height="7" rx="2" />
              </svg>
              My Tasks
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 ml-11">
              Manage and track your daily progress
            </p>
          </div>

          {/* Create Task Button */}
          <a
            href="/tasks/create"
            className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg transition shadow-md flex items-center gap-2 font-medium"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Task
          </a>
        </div>

        {/* Bottom Row: Segmented Filter Bar */}
        <div className="bg-gray-100 dark:bg-gray-800/50 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700/50 inline-flex w-fit backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  filter === tab.id
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-white/10"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* --- NEW HEADER SECTION END --- */}

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
                    ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
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
                          : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700"
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
                    ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Next →
              </button>
            </div>

            {/* Page Info */}
            <div className="text-center mt-4 text-gray-600 dark:text-gray-400 text-sm">
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
