const API_URL = "http://localhost:5000/api"; // Backend URL

// ✅ Function to get authentication headers safely
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("⚠️ No token found. User might not be logged in.");
    return {}; // Return empty object if no token
  }
  return { Authorization: `Bearer ${token}` };
};

// ✅ Get all tasks for the authenticated user
export const getTasks = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  const response = await fetch(`${API_URL}/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks (Status: ${response.status})`);
  }

  return await response.json();
};

// ✅ Add a new task (no need to pass userId)
export const addTask = async (taskData) => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(), // Include auth headers for consistency
      },
      body: JSON.stringify(taskData), // taskData should be an object, e.g., { text: "Your task text" }
    });

    if (!response.ok) {
      throw new Error(`Failed to add task (Status: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error adding task:", error.message);
    throw error;
  }
};

// ✅ Update a task (no need to pass userId)
export const updateTask = async (taskId, text) => {
  if (!taskId) {
    console.error("❌ Missing task ID.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update task (Status: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating task:", error.message);
    throw error;
  }
};

// ✅ Delete a task (no need to pass userId)
export const deleteTask = async (taskId) => {
  if (!taskId) {
    console.error("❌ Missing task ID.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete task (Status: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error deleting task:", error.message);
    throw error;
  }
};

// ✅ Toggle task completion (no need to pass userId)
export const toggleTaskCompletion = async (taskId) => {
  if (!taskId) {
    console.error("❌ Missing task ID.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}/toggle`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle task completion (Status: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error toggling task completion:", error.message);
    throw error;
  }
};
