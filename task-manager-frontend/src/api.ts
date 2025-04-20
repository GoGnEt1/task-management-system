
const API_URL = "http://127.0.0.1:5002/tasks";

export const getTasks = async (status = "") => {
  const response = await fetch(`${API_URL}${status ? `?status=${status}` : ""}`);
  return response.json();
};

export interface Task {
  id?: number;
  title: string;
  description: string;
  priority: string;
  status?: string;
  due_date: string;
  updated_at?: string;
}

export const addTask = async (task: Task): Promise<void> => {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
};

export const updateTaskStatus = async (taskId: number, status: string): Promise<void> => {
  await fetch(`${API_URL}/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
};

export async function updateTask(taskId: number, updates: Partial<Task>): Promise<Task> {
  const response = await fetch(`${API_URL}/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
  });
  return response.json();
}

export const deleteTask = async (taskId: number): Promise<void> => {
  await fetch(`${API_URL}/${taskId}`, { method: "DELETE" });
};

// export default api;