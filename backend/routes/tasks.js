const express = require("express");
const Task = require("../models/task");
const authMiddleware = require("../middleware/auth");
const mongoose = require("mongoose");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    console.log("📤 Fetching tasks for user:", req.user.userId);
    const tasks = await Task.find({ userId: req.user.userId });
    res.json(tasks);
  } catch (error) {
    console.error("❌ Error fetching tasks:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    console.warn("⚠️ Task text is missing in request body");
    return res.status(400).json({ message: "Task text is required" });
  }

  try {
    const newTask = new Task({
      text,
      completed: false,
      userId: req.user.userId,
    });
    await newTask.save();
    console.log("✅ Task created:", newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("❌ Error creating task:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  let { text } = req.body;

  if (typeof text === "object" && text !== null) {
    console.warn("⚠️ Received object instead of string:", text);
    text = text.title;
  }

  if (!text || typeof text !== "string") {
    return res.status(400).json({ message: "Invalid task text format" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.text = text;
    await task.save();

    res.json(task);
  } catch (error) {
    console.error("❌ Error updating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



router.put("/:id/toggle", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid Task ID" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!task) {
      console.warn("⚠️ Task not found:", req.params.id);
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();
    console.log("✅ Task completion toggled:", task);
    res.json({ completed: task.completed });
  } catch (error) {
    console.error("❌ Error toggling task:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid Task ID" });
  }

  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!task) {
      console.warn("⚠️ Task not found or unauthorized:", req.params.id);
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    console.log("✅ Task deleted:", req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting task:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
