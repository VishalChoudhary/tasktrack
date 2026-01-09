const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getSummary,
  getRecentTasks,
  getOverdueTasks,
  getPriorityStats,
} = require("../controllers/dashboardController");

// GET /api/dashboard/summary
router.get("/summary", authMiddleware, getSummary);

// GET /api/dashboard/recent-tasks
router.get("/recent-tasks", authMiddleware, getRecentTasks);

// GET /api/dashboard/overdue-tasks
router.get("/overdue-tasks", authMiddleware, getOverdueTasks);

// GET /api/dashboard/priority-stats
router.get("/priority-stats", authMiddleware, getPriorityStats);

module.exports = router;
