import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Creating axios instance
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
  // TASKS CRUD
  createTask: (data) => api.post("/tasks", data),
  getTasks: (params = {}) => {
    const defaultParams = {
      page: params.page || 1,
      limit: params.limit || 9,
      ...params,
    };
    return api.get("/tasks", { params: defaultParams });
  },
  getTaskById: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),

  // SUBTASKS
  addSubtask: (taskId, data) => api.post(`/tasks/${taskId}/subtasks`, data),
  getSubTasks: (taskId) => api.get(`/tasks/${taskId}/subtasks`),
  toggleSubtask: (taskId, subtaskId, completed) =>
    api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`, { completed }),
  updateSubtask: (taskId, subtaskId, title) =>
    api.put(`/tasks/${taskId}/subtasks/${subtaskId}`, { title }),
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
