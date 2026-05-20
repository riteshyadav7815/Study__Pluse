import { create } from "zustand";
import type { Task } from "@/lib/types";
import taskService from "@/services/taskService";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  pagination: { page: number; limit: number; total: number; pages: number } | null;

  fetchTasks: (params?: {
    status?: string;
    subject?: string;
    date?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  fetchTasksOnce: () => Promise<void>;
  createTask: (data: Parameters<typeof taskService.create>[0]) => Promise<void>;
  updateTaskStatus: (id: string, status: Task["status"], actualHours?: number) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearTasks: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  hasFetched: false,
  pagination: null,

  fetchTasks: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await taskService.getAll(params ?? { limit: 500 });
      set({ tasks: res.data, pagination: res.pagination, isLoading: false, hasFetched: true });
    } catch (err: any) {
      set({ isLoading: false, error: err?.response?.data?.message || "Failed to fetch tasks" });
    }
  },

  fetchTasksOnce: async () => {
    const { hasFetched, isLoading, fetchTasks } = get();
    if (hasFetched || isLoading) return;
    await fetchTasks();
  },

  createTask: async (data) => {
    try {
      const res = await taskService.create(data);
      set((state) => {
        const newTasks = [...state.tasks, res.data].sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          return a.startTime.localeCompare(b.startTime);
        });
        return { tasks: newTasks };
      });
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Failed to create task");
    }
  },

  updateTaskStatus: async (id, status, actualHours) => {
    try {
      const updateData: any = { status };
      if (actualHours !== undefined) updateData.actualHours = actualHours;
      const res = await taskService.update(id, updateData);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? res.data : t)),
      }));
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Failed to update task");
    }
  },

  deleteTask: async (id) => {
    try {
      await taskService.delete(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
      }));
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Failed to delete task");
    }
  },

  clearTasks: () => set({ tasks: [], pagination: null, error: null, hasFetched: false }),
}));
