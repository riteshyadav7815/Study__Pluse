import api from "@/lib/api";
import type { ApiResponse, Notification } from "@/lib/types";

const notificationService = {
  create: async (data: { title: string; message: string; type?: string }) => {
    const res = await api.post<ApiResponse<Notification>>("/notifications", data);
    return res.data;
  },

  getAll: async () => {
    const res = await api.get<ApiResponse<Notification[]>>("/notifications");
    return res.data;
  },

  markAsRead: async (id: string) => {
    const res = await api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
    return res.data;
  },
};

export default notificationService;