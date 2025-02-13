const API_URL = "http://localhost:5000/api/tasks"; 

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getTasks = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    throw error;
  }
};
export const addTask = async (text) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error("Failed to add task");
    return await response.json();
  } catch (error) {
    console.error("❌ Error adding task:", error);
    throw error;
  }
};

export const updateTask = async (id, text) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return await response.json();
  } catch (error) {
    console.error("❌ Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) throw new Error("Failed to delete task");
    return await response.json();
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    throw error;
  }
};

export const toggleTaskCompletion = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}/toggle`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) throw new Error("Failed to toggle task completion");
    return await response.json(); 
  } catch (error) {
    console.error("❌ Error toggling task completion:", error);
    throw error;
  }
};
