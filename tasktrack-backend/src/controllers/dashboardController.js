const Task = require("../models/Task");

// GET /api/dashboard/summary
// Returns: Total tasks, counts by status, overdue count, completion %

const getSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    // All metrics filter by current user
    const userQuery = { userId };

    // Count Total Tasks
    const totalTasks = await Task.countDocuments(userQuery);

    // Count by Status (todo,in-progress,done)
    const todoCount = await Task.countDocuments({
      ...userQuery,
      status: "todo",
    });

    const inProgressCount = await Task.countDocuments({
      ...userQuery,
      status: "in-progress",
    });

    const doneCount = await Task.countDocuments({
      ...userQuery,
      status: "done",
    });

    // Calculate Overdue Tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Counts tasks that are late and still incomplete
    const overdueCount = await Task.countDocuments({
      userId,
      dueDate: { $lt: today },
      status: { $ne: "done" },
    });

    // Calculate Completion Percentage
    const completionPercentage =
      totalTasks === 0 ? 0 : Math.round((doneCount / totalTasks) * 100);

    // Return Summary
    return res.status(200).json({
      success: true,
      data: {
        totalTasks,
        todoCount,
        inProgressCount,
        doneCount,
        overdueCount,
        completionPercentage,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get Summary error: ", error);
    return res.status(500).json({
      success: false,
      error: "Error computing dashboard Summary",
    });
  }
};

// GET /api/dashboard/recent-tasks?limit=5
// Returns: Last N tasks sorted by creation date (newest first)

const getRecentTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    // Query Database
    const recentTasks = await Task.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("title status priority dueDate createdAt");

    return res.status(200).json({
      success: true,
      data: {
        recentTasks: recentTasks.map((task) => ({
          id: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          createdAt: task.createdAt,
        })),
        count: recentTasks.length,
        limit,
      },
      timeStamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get recent tasks error: ", error);
    return res.status(500).json({
      success: false,
      error: "Error fetching recent tasks",
    });
  }
};

// GET /api/dashboard/overdue-tasks
// (Optional feature, but useful for frontend alert)

const getOverdueTasks = async (req, res) => {
  try {
    const userId = req.user.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Query Overdue Tasks
    const overdueTasks = await Task.find({
      userId,
      dueDate: { $lt: today },
      status: { $ne: "done" },
    })
      .sort({ dueDate: 1 })
      .select("title status priority dueDate");

    return res.status(200).json({
      success: true,
      data: {
        overdueTasks: overdueTasks.map((task) => ({
          id: task._id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          daysOverdue: Math.floor(
            (today - new Date(task.dueDate)) / (1000 * 60 * 60 * 24)
          ),
        })),
        count: overdueTasks.length,
      },
      timeStamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get overdue tasks error:", error);
    return res.status(500).json({
      success: false,
      error: "Error fetching overdue tasks",
    });
  }
};

// GET /api/dashboard/priority-stats
// Returns: Count of tasks by priority level
// (Optional, for future charts)

const getPriorityStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Count by Priority
    const lowCount = await Task.countDocuments({
      userId,
      priority: "low",
    });

    const mediumCount = await Task.countDocuments({
      userId,
      priority: "medium",
    });

    const highCount = await Task.countDocuments({
      userId,
      priority: "high",
    });

    return res.status(200).json({
      success: true,
      data: {
        lowPriority: lowCount,
        mediumPriority: mediumCount,
        highPriority: highCount,
        total: lowCount + mediumCount + highCount,
      },
      timeStamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get priority stats error:", error);
    return res.status(500).json({
      success: false,
      error: "Error computing priority statistics",
    });
  }
};

module.exports = {
  getSummary,
  getRecentTasks,
  getOverdueTasks,
  getPriorityStats,
};
