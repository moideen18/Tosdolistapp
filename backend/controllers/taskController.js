const Task = require("../models/task");
const mongoose = require("mongoose");

// ✅ Get all tasks for the authenticated user
exports.getTasks = async (req, res) => {
    try {
        console.log("📤 Fetching tasks for user:", req.user.id);
        const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error("❌ Error fetching tasks:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Create a new task
exports.addTask = async (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
        console.warn("⚠️ Invalid or missing task text");
        return res.status(400).json({ message: "Task text is required and must be a string" });
    }

    try {
        const newTask = new Task({
            text,
            completed: false,
            userId: req.user.id,
        });

        await newTask.save();
        console.log("✅ Task created:", newTask);
        res.status(201).json(newTask);
    } catch (error) {
        console.error("❌ Error creating task:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Update a task's text
exports.updateTask = async (req, res) => {
    const { text } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Task ID" });
    }

    if (!text || typeof text !== "string") {
        return res.status(400).json({ message: "Invalid task text format" });
    }

    try {
        const task = await Task.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { text },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }

        console.log("✅ Task updated:", task);
        res.json(task);
    } catch (error) {
        console.error("❌ Error updating task:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Toggle task completion
exports.toggleTaskCompletion = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Task ID" });
    }

    try {
        const task = await Task.findOne({ _id: id, userId: req.user.id });

        if (!task) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }

        task.completed = !task.completed;
        await task.save();
        console.log("✅ Task completion toggled:", task);
        res.json({ completed: task.completed });
    } catch (error) {
        console.error("❌ Error toggling task completion:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Delete a task
exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Task ID" });
    }

    try {
        const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });

        if (!task) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }

        console.log("✅ Task deleted:", id);
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting task:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
    