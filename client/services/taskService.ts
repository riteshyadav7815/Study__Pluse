import api from "@/lib/api";
import type { ApiResponse, Task, TaskFormData, PaginatedResponse } from "@/lib/types";

const taskService = {
  create: async (data: TaskFormData) => {
    const res = await api.post<ApiResponse<Task>>("/tasks", data);
    return res.data;
  },

  getAll: async (params?: {
    status?: string;
    subject?: string;
    date?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await api.get<PaginatedResponse<Task>>("/tasks", { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return res.data;
  },

  getToday: async () => {
    const res = await api.get<ApiResponse<Task[]>>("/tasks/today");
    return res.data;
  },

  update: async (id: string, data: Partial<TaskFormData & { status: string; actualHours: number }>) => {
    const res = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/tasks/${id}`);
    return res.data;
  },
};

export default taskService;