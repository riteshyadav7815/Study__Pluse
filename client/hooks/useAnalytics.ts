"use client";

import { useState, useEffect, useCallback } from "react";
import type { PerformanceReport } from "@/lib/types";
import analyticsService from "@/services/analyticsService";

export function useAnalytics() {
  const [reports, setReports] = useState<PerformanceReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await analyticsService.getReports();
      setReports(res.data);
    } catch {
      setError("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateReport = useCallback(async (periodType: "weekly" | "monthly", periodLabel: string) => {
    const res = await analyticsService.generateReport(periodType, periodLabel);
    return res.data;
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, isLoading, error, fetchReports, generateReport };
}
