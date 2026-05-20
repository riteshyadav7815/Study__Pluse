import api from "@/lib/api";
import type { ApiResponse, TimetableEntry, TimetableFormData } from "@/lib/types";

const timetableService = {
  create: async (data: TimetableFormData) => {
    const res = await api.post<ApiResponse<TimetableEntry>>("/timetable", data);
    return res.data;
  },

  getAll: async (day?: string) => {
    const res = await api.get<ApiResponse<TimetableEntry[]>>("/timetable", { params: day ? { day } : {} });
    return res.data;
  },

  update: async (id: string, data: Partial<TimetableFormData>) => {
    const res = await api.put<ApiResponse<TimetableEntry>>(`/timetable/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/timetable/${id}`);
    return res.data;
  },
};

export default timetableService;