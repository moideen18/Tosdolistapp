const express = require("express");
const Task = require("../models/task");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/", async (req, res) => {
  const { text } = req.body;
  try {
    if (!text)
      return res.status(400).json({ message: "Task text is required" });
    const newTask = new Task({
      text,
      completed: false,
      userId: req.user.userId,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
router.put("/:id", async (req, res) => {
  const { text } = req.body;
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!task)
      return res.status(404).json({ message: "Task not found or unauthorized" });
    task.text = text;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
router.put("/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.completed = !task.completed;
    await task.save();
    res.json({ completed: task.completed });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!task)
      return res.status(404).json({ message: "Task not found or unauthorized" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
