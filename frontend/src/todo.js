  import React, { useState, useEffect } from "react";
import { getTasks, addTask, updateTask, deleteTask, toggleTaskCompletion } from "./api";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import "./todo.css";

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const tasksData = await getTasks();
      const sortedTasks = tasksData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTasks(sortedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddOrUpdateTask = async () => {
    if (task.trim()) {
      try {
        if (isEditing) {
          await updateTask(editId, task);
          setTasks((prevTasks) =>
            prevTasks.map((t) => (t._id === editId ? { ...t, text: task } : t))
          );
        } else {
          const newTask = await addTask(task);
          setTasks((prevTasks) => [newTask, ...prevTasks]);
        }
        setTask("");
        setIsEditing(false);
        setEditId(null);
      } catch (error) {
        console.error("Error adding/updating task:", error);
      }
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = (id, text) => {
    setTask(text);
    setIsEditing(true);
    setEditId(id);
  };

  const handleCompleteTask = async (id) => {
    try {
      const updatedTask = await toggleTaskCompletion(id);
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === id ? { ...t, completed: updatedTask.completed } : t
        )
      );
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
    }
  };

  return (
    <div className="todo-container">
      <h2>To-Do List</h2>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a task"
        className="todo-input"
      />
      <button className="add-btn" onClick={handleAddOrUpdateTask}>
        {isEditing ? "Update Task" : "Add Task"}
      </button>

      <ul>
        {tasks.map((t) => (
          <li key={t._id} className={t.completed ? "completed-task" : ""}>
            {t.text}
            <div className="btn-group">
              <button
                className="complete-btn"
                onClick={() => handleCompleteTask(t._id)}
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
        ))}
      </ul>
    </div>
  );
}

export default Todo;
