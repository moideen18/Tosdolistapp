const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
} = require("../controllers/taskController");

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, addTask);
router.put("/:taskId", authMiddleware, updateTask);
router.put("/:taskId/toggle", authMiddleware, toggleTaskCompletion);
router.delete("/:taskId", authMiddleware, deleteTask);

module.exports = router;
