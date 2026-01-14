import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { dashboardAPI } from "../services/api";
import StatCard from "../components/Dashboard/StatCard";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch summary stats
      const summaryResponse = await dashboardAPI.getSummary();
      setStats(summaryResponse.data.data);

      // Fetch recent tasks
      try {
        const recentResponse = await dashboardAPI.getRecentTasks(5);
        setRecentTasks(recentResponse.data.data || []);
      } catch (error) {
        console.log("Recent tasks fetch failed: ", error);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Failed to load dashboard";
      setError(errorMsg);
      console.log("Dashboard error: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4">
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-medium mb-2">⚠️ Error</p>
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!stats) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">Here's your task overview for today</p>
      </div>

      {/* Stats Grid - 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Tasks"
          value={stats.totalTasks || 0}
          color="blue"
          icon="🗂️"
        />
        <StatCard
          label="To Do"
          value={stats.todoCount || 0}
          color="orange"
          icon="📝"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgressCount || 0}
          color="yellow"
          icon="🔄"
        />
        <StatCard
          label="Done"
          value={stats.doneCount || 0}
          color="green"
          icon="🎯"
        />
      </div>

      {/* Progress Section */}
      <div className="bg-white rouded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Overall Completion
        </h2>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progress </span>
            <span className="text-sm font-bold text-indigo-600">
              {stats.completionPercentage || 0}%
            </span>
          </div>

          {/* Bar itself */}
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${stats.completionPercentage || 0}%`,
              }}
            />
          </div>
        </div>

        {/* Completion Text */}
        <p className="text-sm text-gray-600">
          {stats.doneCount} of {stats.totalTasks} tasks completed
        </p>
      </div>

      {/* Overdue Section */}
      {stats.overdueCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            ⚠️ {stats.overdueCount} Overdue Task
            {stats.overdueCount !== 1 ? "s" : ""}
          </h3>
          <p className="text-red-600 text-sm">
            You have {stats.overdueCount} task
            {stats.overdueCount !== 1 ? "s" : ""} that{" "}
            {stats.overdueCount !== 1 ? "are" : "is"} overdue. Please prioritize
            these.
          </p>
        </div>
      )}

      {/* Recent Tasks Section */}
      {recentTasks.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Tasks
          </h2>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div
                key={task._id || task.id}
                className="flex items-center justify-between border border-gray-200 rounded p-4 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <p className="font-medium text-gray-600">
                    {task.description || "No description"}
                  </p>
                </div>

                <div className="flex gap-2">
                  {/* Status badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === "done"
                        ? "bg-green-100 text-green-700"
                        : task.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {task.status}
                  </span>

                  {/* Priority badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            <a href="/tasks" className="text-indigo-600 hover:underline">
              View all tasks →
            </a>
          </p>
        </div>
      )}

      {/* Empty state */}
      {recentTasks.length === 0 && stats.totalTasks === 0 && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">
            You don't have any tasks yet. Let's create one!
          </p>
          <a
            href="/tasks"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded transition"
          >
            Create First Task →
          </a>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
