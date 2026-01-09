const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    // ========== REQUIRED FIELDS ==========
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Title must be atleast 3 characters"],
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    // ========== STATUS FIELD ==========
    status: {
      type: String,
      enum: {
        values: ["todo", "in-progress", "done"],
        message: "Status must be: todo, in-progress, done",
      },
      default: "todo",
    },
    // ========== PRIORITY FIELD ==========
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be low, medium or high",
      },
      default: "medium",
    },
    // ========== DATE FIELDS ==========
    // When this task is due
    dueDate: {
      type: Date,
      required: true,
    },

    // ========== REFERENCE FIELD ==========
    // Link this task to a user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ========== METADATA ==========
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    // Has this task been completed?
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // ← Auto-update updatedAt
  }
);

//Adding Indexes when querying tasks for a specific user
taskSchema.index({ userId: 1 });
taskSchema.index({ dueDate: 1 });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
