"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useCallback } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useTasks } from "@/hooks/useTasks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  Download,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Flame,
  Brain,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAnalyticsInsights,
  getStrongAndWeakSubjects,
  getSubjectPerformance,
  getTaskStats,
} from "@/lib/taskAnalytics";

const ProgressTrendChart = dynamic(
  () => import("@/charts/ProgressTrendChart").then((mod) => mod.ProgressTrendChart),
  { ssr: false, loading: () => <Skeleton className="h-[300px] rounded-xl" /> }
);
const SubjectPerformanceChart = dynamic(
  () => import("@/charts/SubjectPerformanceChart").then((mod) => mod.SubjectPerformanceChart),
  { ssr: false, loading: () => <Skeleton className="h-[300px] rounded-xl" /> }
);
const CompletionPieChart = dynamic(
  () => import("@/charts/CompletionPieChart").then((mod) => mod.CompletionPieChart),
  { ssr: false, loading: () => <Skeleton className="h-[300px] rounded-xl" /> }
);

export default function AnalyticsPage() {
  const {
    reports,
    isLoading: reportsLoading,
    generateReport,
    fetchReports,
  } = useAnalytics();
  const { tasks, isLoading: tasksLoading } = useTasks();

  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = useCallback(async (type: "weekly" | "monthly") => {
    setGenerating(true);
    try {
      const label =
        type === "weekly"
          ? `Week ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
          : new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

      await generateReport(type, label);
      toast.success(`${type === "weekly" ? "Weekly" : "Monthly"} report generated!`);
      fetchReports();
    } catch {
      toast.error("Failed to generate report");
    } finally {
      setGenerating(false);
    }
  }, [fetchReports, generateReport]);

  const stats = useMemo(() => getTaskStats(tasks), [tasks]);
  const subjectPerformance = useMemo(() => getSubjectPerformance(tasks), [tasks]);
  const { strongSubjects, weakSubjects } = useMemo(() => getStrongAndWeakSubjects(tasks), [tasks]);
  const insights = useMemo(() => getAnalyticsInsights(tasks), [tasks]);
  const isLoading = tasksLoading || reportsLoading;
  const totalTasks = tasks.length;
  const completedTasks = stats.completedTasks.length;
  const pendingTasks = stats.pendingTasks.length;
  const efficiencyScore = stats.plannedHoursToday
    ? Math.round((stats.completedStudyHoursToday / stats.plannedHoursToday) * 100)
    : 0;
  const overallPerformance = Math.round((stats.completionRate * 0.7 + efficiencyScore * 0.3));

  // Build trend data from reports (newest first, reversed for chart)
  const trendData = useMemo(
    () =>
      [...reports]
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map((report) => ({
          label: report.periodLabel,
          completionRate: report.completionRate,
          efficiencyScore: report.efficiencyScore,
          consistencyScore: report.consistencyScore,
        })),
    [reports]
  );

  const subjectChartData = useMemo(
    () =>
      subjectPerformance.map((subject) => ({
        subject: subject.subject,
        completionRate: subject.completionRate,
        efficiency: subject.efficiency,
      })),
    [subjectPerformance]
  );

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Analytics</h1>
            <p className="text-muted-foreground">
              Track your performance and identify areas for improvement
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerateReport("weekly")}
              isLoading={generating}
            >
              <Download className="mr-2 h-4 w-4" />
              Weekly Report
            </Button>
            <Button
              size="sm"
              onClick={() => handleGenerateReport("monthly")}
              isLoading={generating}
            >
              <Download className="mr-2 h-4 w-4" />
              Monthly Report
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-[400px] rounded-xl" />
          </div>
        ) : totalTasks === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <BarChart3 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">No analytics data yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and complete study tasks to see analytics.
            </p>
          </div>
        ) : (
          <>
            {/* Key metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Target className="h-4 w-4" />
                    Completion Rate
                  </div>
                  <div className="text-2xl font-bold">
                    {stats.completionRate}%
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {completedTasks} of {totalTasks} tasks
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    Study Hours
                  </div>
                  <div className="text-2xl font-bold">
                    {stats.totalCompletedStudyHours.toFixed(1)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Total hours tracked
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Zap className="h-4 w-4" />
                    Efficiency
                  </div>
                  <div className="text-2xl font-bold">
                    {efficiencyScore}%
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Planned vs actual hours
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Brain className="h-4 w-4" />
                    Overall Score
                  </div>
                  <div className="text-2xl font-bold">
                    {overallPerformance}%
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Performance index
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts row */}
            <div className="grid gap-6 lg:grid-cols-2">
              <CompletionPieChart
                completed={completedTasks}
                pending={pendingTasks}
              />
              <SubjectPerformanceChart
                data={subjectChartData}
              />
            </div>

            {/* Progress Trend */}
            <ProgressTrendChart data={trendData} />

            {/* Strong & Weak Subjects */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    <CardTitle className="text-lg">Strong Subjects</CardTitle>
                  </div>
                  <CardDescription>
                    Subjects where you excel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {strongSubjects.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Complete more tasks to identify strong subjects.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {strongSubjects.map((s) => (
                        <Badge key={s} variant="default">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-destructive" />
                    <CardTitle className="text-lg">Weak Subjects</CardTitle>
                  </div>
                  <CardDescription>
                    Areas that need more focus
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {weakSubjects.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Add more tasks across subjects to get insights.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {weakSubjects.map((s) => (
                        <Badge key={s} variant="destructive">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Reports history */}
            {insights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Insights</CardTitle>
                  <CardDescription>Based on your current tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {insights.map((insight) => (
                      <div key={insight} className="rounded-lg border p-3 text-sm text-muted-foreground">
                        {insight}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {reports.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Report History</CardTitle>
                  <CardDescription>
                    Previously generated performance reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div
                        key={report._id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <BarChart3 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{report.periodLabel}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {report.periodType} report
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              {Math.round(report.overallPerformance)}%
                            </p>
                            <p className="text-xs text-muted-foreground">Overall</p>
                          </div>
                          {report.aiInsights.length > 0 && (
                            <Flame className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
    </div>
  );
}
