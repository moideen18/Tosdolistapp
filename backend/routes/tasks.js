const express = require("express");
const router = express.Router();
const { getTasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = require("../controllers/taskController");
const authMiddleware = require("../middleware/auth"); // ✅ Import auth middleware

// ✅ Protect all routes with authMiddleware
router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, addTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.put("/:id/toggle", authMiddleware, toggleTaskCompletion);

module.exports = router;
