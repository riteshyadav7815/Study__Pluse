import api from "@/lib/api";
import type { ApiResponse, User } from "@/lib/types";

const authService = {
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await api.post<ApiResponse<User>>("/auth/register", data);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post<ApiResponse<User>>("/auth/login", data);
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get<ApiResponse<User>>("/auth/profile");
    return res.data;
  },
};

export default authService;