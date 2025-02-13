const express = require("express");
const User = require("../models/user");
const User = require("../models/task");
const router = express.Router();

router.get("/:userId/tasks", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.post("/:userId/tasks", async (req, res) => {
    const { text } = req.body;

    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const newTask = { text };
        user.tasks.push(newTask);
        await user.save();

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.put("/:userId/tasks/:taskId", async (req, res) => {
    const { text } = req.body;

    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const task = user.tasks.id(req.params.taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.text = text; 
        await user.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.delete("/:userId/tasks/:taskId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.tasks = user.tasks.filter(task => task._id.toString() !== req.params.taskId);
        await user.save();

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
