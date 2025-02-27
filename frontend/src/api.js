const API_URL = "http://localhost:5000/api"; // Backend URL

// ✅ Function to get authentication headers safely
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {}; // Only return if token exists
};

// ✅ Handle API response with better error handling
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (err) {
      console.error("❌ Failed to parse error response", err);
    }

    if (response.status === 401) {
      console.warn("🔐 Unauthorized! Logging out...");
      localStorage.removeItem("token"); // Clear token if expired
      window.location.href = "/login"; // Redirect to login
    }

    throw new Error(errorMessage);
  }
  return response.json();
};

// ✅ Fetch all tasks
export const getTasks = async () => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "GET",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    throw error;
  }
};

// ✅ Add a new task
export const addTask = async (taskText) => {
  if (!taskText?.trim()) {
    console.error("❌ Task text is required.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ text: taskText }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("❌ Error adding task:", error);
    throw error;
  }
};

// ✅ Update a task
export const updateTask = async (taskId, newText) => {
  if (!taskId || !newText?.trim()) {
    console.error("❌ Task ID and text are required.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ text: newText }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("❌ Error updating task:", error);
    throw error;
  }
};

// ✅ Delete a task
export const deleteTask = async (taskId) => {
  if (!taskId) {
    console.error("❌ Task ID is required.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    throw error;
  }
};

// ✅ Toggle task completion
export const toggleTaskCompletion = async (taskId) => {
  if (!taskId) {
    console.error("❌ Task ID is required.");
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

    return await handleResponse(response);
  } catch (error) {
    console.error("❌ Error toggling task completion:", error.message);
    throw error;
  }
};

// ✅ Export all functions correctly
