import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {getTasks,addTask,updateTask,deleteTask,toggleTaskCompletion,} from "../../api";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./todo.css";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized! Please log in.");
      setTimeout(() => navigate("/home"), 2000);
      return;
    }
    fetchTasks();
  }, [navigate]);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const tasks = await getTasks(); // API extracts user from token
      setTasks(tasks);
    } catch (error) {
      console.error("❌ Error fetching tasks:", error.message);
      toast.error("Failed to load tasks.");
    }
  };

  const handleAddOrUpdateTask = async () => {
    if (!task.trim()) {
      toast.warning("Task cannot be empty!");
      return;
    }

    try {
      if (isEditing) {
        // Update existing task (updateTask expects taskId and text)
        await updateTask(editId, task);
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t._id === editId ? { ...t, text: task } : t
          )
        );
        toast.success("Task updated successfully!");
      } else {
        // Add new task (addTask expects task data with a `text` property)
        const newTask = await addTask({ text: task });
        setTasks((prevTasks) => [newTask, ...prevTasks]);
        toast.success("Task added successfully!");
      }

      // Reset input and editing state
      setTask("");
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      console.error("❌ Error adding/updating task:", error);
      toast.error("Failed to save task!");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== id));
      toast.info("Task deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting task:", error);
      toast.error("Failed to delete task!");
    }
  };

  const handleEditTask = (id, text) => {
    setTask(text || "");
    setIsEditing(true);
    setEditId(id);
  };

  const handleCompleteTask = async (id, completed) => {
    try {
      const updatedTask = await toggleTaskCompletion(id);
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === id ? { ...t, completed: updatedTask.completed } : t
        )
      );
      toast.success(
        updatedTask.completed
          ? "Task marked as completed!"
          : "Task marked as incomplete!"
      );
    } catch (error) {
      console.error("❌ Failed to toggle task completion:", error);
      toast.error("Failed to update task status!");
    }
  };

  // In your Todo component or wherever you're handling logout:
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId"); // if stored
  toast.info("Logging out...");
  setTimeout(() => navigate("/"), 1500); // Change "/home" to "/"
};
  

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddOrUpdateTask();
    }
  };

  return (
    <div className="todo-page">
      {/* Navbar with Logout Button */}
      <nav className="navbar">
        <h1>TODO LIST</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>

      <ToastContainer />

      <div className="todo-container">
        <h2>To-Do List</h2>
        <div className="input-group">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter a task"
            className="todo-input"
          />
          <button className="add-btn" onClick={handleAddOrUpdateTask}>
            {isEditing ? "Update Task" : "Add Task"}
          </button>
        </div>

        <ul>
          {tasks.length > 0 ? (
            tasks.map((t) => (
              <li key={t._id} className={t.completed ? "completed-task" : ""}>
                <span>{t.text}</span>
                <div className="btn-group">
                  <button
                    className="complete-btn"
                    onClick={() => handleCompleteTask(t._id, t.completed)}
                    title="Complete Task"
                  >
                    <FaCheck />
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditTask(t._id, t.text)}
                    title="Edit Task"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteTask(t._id)}
                    title="Delete Task"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="no-tasks">No tasks available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
