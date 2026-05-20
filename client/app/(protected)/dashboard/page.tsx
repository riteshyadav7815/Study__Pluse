"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CheckCircle2, Clock, Flame, Target } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { StatCard } from "@/components/features/StatCard";
import { TaskCard } from "@/components/features/TaskCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getTaskStats, getStudyStreak, sortTasksForDashboard } from "@/lib/taskAnalytics";
import { getToday } from "@/lib/utils";
import type { Task } from "@/lib/types";

export default function DashboardPage() {
  const { tasks, isLoading: tasksLoading, updateTaskStatus, deleteTask } = useTasks();
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  const stats = useMemo(() => getTaskStats(tasks), [tasks]);
  const studyStreak = useMemo(() => getStudyStreak(tasks), [tasks]);
  const sortedTasks = useMemo(() => sortTasksForDashboard(tasks), [tasks]);
  const todayPending = useMemo(
    () => sortedTasks.filter((task) => task.date === getToday() && task.status === "Pending"),
    [sortedTasks]
  );
  const upcomingTasks = useMemo(
    () => sortedTasks.filter((task) => task.date > getToday() && task.status === "Pending").slice(0, 6),
    [sortedTasks]
  );
  const completedTasks = useMemo(
    () => sortedTasks.filter((task) => task.status === "Completed").slice(0, 6),
    [sortedTasks]
  );

  const handleStatusChange = useCallback(
    async (id: string, status: Task["status"]) => {
      setStatusUpdating(id);
      try {
        await updateTaskStatus(id, status);
        toast.success("Task marked as completed");
      } catch {
        toast.error("Failed to update task");
      } finally {
        setStatusUpdating(null);
      }
    },
    [updateTaskStatus]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteTask(id);
        toast.success("Task deleted");
      } catch {
        toast.error("Failed to delete task");
      }
    },
    [deleteTask]
  );

  const renderSection = (title: string, sectionTasks: Task[], emptyText: string) => (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {sectionTasks.length} task{sectionTasks.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/tasks">
          <Button variant="outline" size="sm">View Tasks</Button>
        </Link>
      </div>
      {sectionTasks.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">{emptyText}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sectionTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              isBusy={statusUpdating === task._id}
            />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="space-y-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">
            Study hours are counted only from completed tasks.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Today Completion Rate"
            value={`${stats.completionRate}%`}
            subtitle={`${stats.todayTasks.filter((task) => task.status === "Completed").length}/${stats.todayTasks.length} tasks completed`}
            progress={stats.completionRate}
            icon={<CheckCircle2 className="h-5 w-5" />}
            isLoading={tasksLoading}
          />
          <StatCard
            title="Planned Hours Today"
            value={stats.plannedHoursToday.toFixed(1)}
            subtitle="End time minus start time"
            icon={<Clock className="h-5 w-5" />}
            isLoading={tasksLoading}
          />
          <StatCard
            title="Completed Study Hours Today"
            value={stats.completedStudyHoursToday.toFixed(1)}
            subtitle="Only completed tasks count"
            icon={<Target className="h-5 w-5" />}
            isLoading={tasksLoading}
          />
          <StatCard
            title="Study Streak"
            value={`${studyStreak}`}
            subtitle={`Total completed hours: ${stats.totalCompletedStudyHours.toFixed(1)}`}
            icon={<Flame className="h-5 w-5" />}
            isLoading={tasksLoading}
          />
        </div>

        {tasksLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {renderSection("Today's Tasks", todayPending, "No pending tasks for today.")}
            {renderSection("Upcoming Tasks", upcomingTasks, "No upcoming pending tasks.")}
            {renderSection("Completed Tasks", completedTasks, "Completed tasks will appear here.")}
          </div>
        )}
    </div>
  );
}
