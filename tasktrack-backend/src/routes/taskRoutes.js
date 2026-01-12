const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const subtaskRoutes = require("./advancedRoutes");

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// All protected tasks route
// Create Task
router.post("/", authMiddleware, createTask);
// Get All Tasks
router.get("/", authMiddleware, getAllTasks);
// Get Task by ID
router.get("/:id", authMiddleware, getTaskById);
// Update Task
router.put("/:id", authMiddleware, updateTask);
// Delete Task
router.delete("/:id", authMiddleware, deleteTask);

// Mount subtask routes under task routes
router.use("/:id/subtasks", subtaskRoutes);

module.exports = router;
