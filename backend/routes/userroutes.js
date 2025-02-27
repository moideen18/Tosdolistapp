const express = require("express");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ✅ GET all tasks for a user
router.get("/users/:userId/tasks", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const user = await User.findById(userId).select("tasks");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, tasks: user.tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// ✅ CREATE a new task for a user
router.post("/users/:userId/tasks", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const { userId } = req.params;

    if (req.user.id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    if (!text || typeof text !== "string") {
      return res.status(400).json({ success: false, message: "Task text is required and must be a string" });
    }

    const newTask = { text, completed: false };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { tasks: newTask } },
      { new: true, select: "tasks" }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(201).json({ success: true, message: "Task added successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// ✅ UPDATE a specific task
router.put("/users/:userId/tasks/:taskId", authMiddleware, async (req, res) => {
  try {
    const { text, completed } = req.body;
    const { userId, taskId } = req.params;

    if (req.user.id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const task = user.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (text) task.text = text;
    if (completed !== undefined) task.completed = completed;
    await user.save();

    res.status(200).json({ success: true, message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// ✅ DELETE a specific task
router.delete("/users/:userId/tasks/:taskId", authMiddleware, async (req, res) => {
  try {
    const { userId, taskId } = req.params;

    if (req.user.id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { tasks: { _id: taskId } } },
      { new: true, select: "tasks" }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
