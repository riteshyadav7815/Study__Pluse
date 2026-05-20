import api from "@/lib/api";
import type { ApiResponse, DashboardAnalytics, PerformanceReport } from "@/lib/types";

const analyticsService = {
  getDashboard: async () => {
    const res = await api.get<ApiResponse<DashboardAnalytics>>("/analytics/dashboard");
    return res.data;
  },

  generateReport: async (periodType: "weekly" | "monthly", periodLabel: string) => {
    const res = await api.post<ApiResponse<PerformanceReport>>("/analytics/report", null, {
      params: { periodType, periodLabel },
    });
    return res.data;
  },

  getReports: async () => {
    const res = await api.get<ApiResponse<PerformanceReport[]>>("/analytics/reports");
    return res.data;
  },
};

export default analyticsService;