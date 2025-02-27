const Task = require("../models/Task");

// 📌 Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Create a new task
exports.addTask = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: "Task text is required" });

    const newTask = new Task({ text, completed: false, userId: req.user.id });
    await newTask.save();
    res.status(201).json({ success: true, message: "Task added successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Update task
exports.updateTask = async (req, res) => {
  try {
    const { text } = req.body;
    const { taskId } = req.params;

    const task = await Task.findOneAndUpdate({ _id: taskId, userId: req.user.id }, { text }, { new: true });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    res.status(200).json({ success: true, message: "Task updated", task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Toggle task completion
exports.toggleTaskCompletion = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findOne({ _id: taskId, userId: req.user.id });

    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    task.completed = !task.completed;
    await task.save();

    res.status(200).json({ success: true, message: "Task completion toggled", task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findOneAndDelete({ _id: taskId, userId: req.user.id });

    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
