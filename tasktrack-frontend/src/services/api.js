import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

//creating axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto-attaching token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Endpoints
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getCurrentUser: () => api.get("/auth/me"),
};

// Task Endpoints

export const taskAPI = {
  //CRUD
  createTask: (data) => api.post("/tasks", data),
  getTasks: (params) => api.get("/tasks", { params }),
  getTask: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),

  //Subtasks
  addSubtask: (taskId, data) => api.post(`tasks/${taskId}/subtasks`, data),
  getSubTasks: (taskId) => api.get(`/tasks/${taskId}/subtasks`),
  toggleSubtask: (taskId, subtaskId, data) =>
    api.put(`/tasks/${taskId}/subtasks/${subtaskId}`, data),
  deleteSubtask: (taskId, subtaskId) =>
    api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`),
};

// Dashboard Endpoints

export const dashboardAPI = {
  getSummary: () => api.get("/dashboard/summary"),
  getRecentTasks: (limit) =>
    api.get("/dashboard/recent-tasks", { params: { limit } }),
  getOverdueTasks: () => api.get("/dashboard/overdue-tasks"),
  getPriorityStats: () => api.get("/dashboard/priority-stats"),
};

export default api;
