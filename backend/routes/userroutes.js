const express = require("express");
const User = require("../models/user");
const router = express.Router();

// GET all tasks for a user
router.get('/users/:userId/tasks', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (!user.tasks || user.tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found for this user" });
        }
        
        res.json(user.tasks);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// CREATE a new task for a user
router.post('/users/:userId/tasks', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ message: "Task text is required" });
    }

    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const newTask = { text };
        user.tasks.push(newTask);
        await user.save();

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// UPDATE a specific task
router.put('/users/:userId/tasks/:taskId', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ message: "Task text is required" });
    }

    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const task = user.tasks.id(req.params.taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.text = text;
        await user.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// DELETE a specific task
router.delete('/users/:userId/tasks/:taskId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.tasks = user.tasks.filter(task => task._id.toString() !== req.params.taskId);
        await user.save();

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
