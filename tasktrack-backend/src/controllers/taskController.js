const Task = require("../models/Task");

// CREATE TASK
// POST /api/tasks
// Request body: { title, description, status, priority, dueDate }
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!dueDate) {
      return res.status(400).json({ error: "Due date is required" });
    }

    // Validate status & priority

    const validStatus = ["todo", "in-progress", "done"];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({
        error: "Status must be: todo, in-progress, or done",
      });
    }

    const validPriorities = ["low", "medium", "high"];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        error: "Priority must be: low, medium or high",
      });
    }

    // Checking Due Date is Valid
    const dueDateTime = new Date(dueDate);
    if (isNaN(dueDateTime.getTime())) {
      return res.status(400).json({
        error: "Due date must be a valid date (YYYY-MM-DD format)",
      });
    }

    // Create Task Object
    const newTask = new Task({
      title: title.trim(),
      description: description ? description.trim() : "",
      status: status || "todo",
      priority: priority || "medium",
      dueDate: dueDateTime,
      userId: req.user.userId,
    });

    await newTask.save(); // saving to Database

    // return success response
    return res.status(201).json({
      message: "Task created successfully",
      task: {
        id: newTask._id,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        createdAt: newTask.createdAt,
      },
    });
  } catch (error) {
    console.log("Created task error: ", error);
    return res.status(500).json({ error: "Error creating task" });
  }
};

// GET ALL TASKS (with filtering, searching, pagination)
// GET /api/tasks?status=todo&priority=high&q=homework&page=1
const getAllTasks = async (req, res) => {
  try {
    const { status, priority, q, page = 1, limit = 10 } = req.query;

    let query = { userId: req.user.userId };

    // Adding status filter if provided
    if (status && status.trim() !== "") {
      query.status = status;
    }

    // Adding priority filter if provided
    if (priority && priority.trim() !== "") {
      query.priority = priority;
    }

    // Add text search if provided (search in title and description)
    if (q && q.trim() !== "") {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Query Database
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip)
      .select("-userId"); // not returning userId

    const total = await Task.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      message: `Found ${tasks.length} tasks`,
      tasks: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updateAt: task.updateAt,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasMore: pageNum < totalPages,
      },
    });
  } catch (error) {
    console.log("Get tasks error: ", error);
    return res.status(500).json({ error: "Error fetching data" });
  }
};

// GET SINGLE TASK
// GET /api/tasks/:id

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    //Check Authorization
    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        error: "Not authorized to access this task",
      });
    }

    return res.status(200).json({
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updateAt: task.updateAt,
      },
    });
  } catch (error) {
    console.log("Get tasks error: ", error);
    return res.status(500).json({ error: "Error fetching data" });
  }
};

// UPDATE TASK
// PUT /api/tasks/:id
// Request body: { title, description, status, priority, dueDate, isCompleted }

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    // Check Authorization
    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        error: "Not authorized to update this task",
      });
    }

    // Prevent Security Issues (User should NOT be able to change userId!)
    if (req.body.userId) {
      return res.status(400).json({
        error: "Cannot change task owner",
      });
    }

    // Validate Updated Fields
    if (req.body.status) {
      const validStatuses = ["todo", "in-progress", "done"];
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({
          error: "Status must be: todo, in-progress, or done",
        });
      }
    }

    if (req.body.priority) {
      const validPriorities = ["low", "medium", "high"];
      if (!validPriorities.includes(req.body.priority)) {
        return res.status(400).json({
          error: "Priority must be: low, medium, or high",
        });
      }
    }

    if (req.body.dueDate) {
      const dueDateTime = new Date(req.body.dueDate);
      if (isNaN(dueDateTime.getTime())) {
        return res.status(400).json({
          error: "Due date must be a valid date",
        });
      }
    }

    //Update Only Provided Fields
    // Only update fields that were sent in request
    if (req.body.title) task.title = req.body.title.trim();
    if (req.body.description !== undefined)
      task.description = req.body.description.trim();
    if (req.body.status) task.status = req.body.status;
    if (req.body.priority) task.priority = req.body.priority;
    if (req.body.dueDate) task.dueDate = new Date(req.body.dueDate);
    if (req.body.isCompleted !== undefined)
      task.isCompleted = req.body.isCompleted;

    await task.save();

    // Return Updated Task
    return res.status(200).json({
      message: "Task updated successfully",
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        isCompleted: task.isCompleted,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update task error:", error);
    return res.status(500).json({ error: "Error updating task" });
  }
};

// DELETE TASK
// DELETE /api/tasks/:id

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        error: "Not authorized to delete this task",
      });
    }

    await Task.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Task successfully deleted",
      taskId: id,
    });
  } catch (error) {
    console.error("Delete task error:", error);
    return res.status(500).json({ error: "Error Deleting task" });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
