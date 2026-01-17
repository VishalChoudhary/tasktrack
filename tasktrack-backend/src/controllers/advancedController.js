const Task = require("../models/Task");
const mongoose = require("mongoose");

// ADD SUBTASK
// POST /api/tasks/:id/subtasks

const addSubtask = async (req, res) => {
  try {
    const id = req.params.id;
    const { title } = req.body;
    const userId = req.user.userId;

    // Validate
    if (!title || title.trim() === "") {
      return res.status(400).json({
        error: "Subtask title is required",
      });
    }

    // Find task and verify ownership
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    if (task.userId.toString() !== userId) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    // Create subtask object
    const newSubtask = {
      _id: new mongoose.Types.ObjectId(),
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
      completedAt: null,
    };

    task.subtasks.push(newSubtask);
    task.updateSubtaskCounts();
    await task.save();

    return res.status(201).json({
      message: "Subtask added successfully",
      subtask: newSubtask,
      counts: {
        total: task.subtasksTotal,
        completed: task.subtasksCompleted,
      },
    });
  } catch (error) {
    console.error("Add subtask error:", error);
    return res.status(500).json({
      error: "Error adding subtask",
    });
  }
};

// GET ALL SUBTASKS
// GET /api/tasks/:id/subtasks

const getSubtasks = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    if (task.userId.toString() !== userId) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    return res.status(200).json({
      subtasks: task.subtasks,
      counts: {
        total: task.subtasksTotal,
        completed: task.subtasksCompleted,
        percantage:
          task.subtasksTotal === 0
            ? 0
            : Math.round((task.subtasksCompleted / task.subtasksTotal) * 100),
      },
    });
  } catch (error) {
    console.error("Get subtasks error:", error);
    return res.status(500).json({
      error: "Error fetching subtasks",
    });
  }
};

// TOGGLE SUBTASK COMPLETION
// PUT /api/tasks/:id/subtasks/:subtaskId

const toggleSubtask = async (req, res) => {
  try {
    const { id, subtaskId } = req.params;
    const { completed } = req.body;
    const userId = req.user.userId;

    // Validate
    if (completed === undefined) {
      return res.status(400).json({
        error: "Completed status is required",
      });
    }

    // Find task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    // Checking ownership
    if (task.userId.toString() !== userId) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    // Find subtask
    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({
        error: "Subtask not found",
      });
    }

    // Toggle completion
    subtask.completed = completed;
    subtask.completedAt = completed ? new Date() : null;

    // Update counts & save
    task.updateSubtaskCounts();
    await task.save();

    return res.status(200).json({
      message: "Subtask updated",
      subtask: subtask,
      counts: {
        total: task.subtasksTotal,
        completed: task.subtasksCompleted,
      },
    });
  } catch (error) {
    console.error("Add subtask error:", error);
    return res.status(500).json({
      error: "Error adding subtask",
    });
  }
};

// DELETE SUBTASK
// DELETE /api/tasks/:id/subtasks/:subtaskId

const deleteSubtask = async (req, res) => {
  try {
    const { id, subtaskId } = req.params;
    const userId = req.user.userId;

    // Find task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    if (task.userId.toString() !== userId) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    // Finding and remove subtask
    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({
        error: "Subtask not found",
      });
    }
    subtask.deleteOne();

    task.updateSubtaskCounts();
    await task.save();

    return res.status(200).json({
      message: "Subtask deleted",
      counts: {
        total: task.subtasksTotal,
        completed: task.subtasksCompleted,
      },
    });
  } catch (error) {
    console.error("Delete subtask error:", error);
    return res.status(500).json({
      error: "Error deleting subtask",
    });
  }
};

// UPDATE /api/tasks/:id/subtasks/:subtaskId
const updateSubtask = async (req, res) => {
  try {
    const { id, subtaskId } = req.params;
    const { title } = req.body;
    const userId = req.user.userId;

    // Validate
    if (!title || title.trim() === "") {
      return res.status(400).json({
        error: "Subtask title is required",
      });
    }

    // Find task and verify ownership
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    if (task.userId.toString() !== userId) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    // Find and update subtask
    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({
        error: "Subtask not found",
      });
    }

    subtask.title = title.trim();
    subtask.updatedAt = new Date();
    await task.save();

    return res.status(200).json({
      message: "Subtask updated",
      subtask: subtask,
    });
  } catch (error) {
    console.error("Update subtask error: ", error);
    return res.status(500).json({
      error: "Error updating subtask",
    });
  }
};

module.exports = {
  addSubtask,
  getSubtasks,
  toggleSubtask,
  deleteSubtask,
  updateSubtask,
};
