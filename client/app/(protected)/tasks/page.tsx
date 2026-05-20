"use client";

import { useMemo, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Calendar, AlertCircle } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/features/TaskCard";
import { TaskForm } from "@/components/features/TaskForm";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Task, TaskFormData } from "@/lib/types";

export default function TasksPage() {
  const { tasks, todayTasks, isLoading: tasksLoading, error: tasksError, createTask, updateTaskStatus, deleteTask } =
    useTasks();

  const [formOpen, setFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  const displayTasks = useMemo(() => {
    const source = showTodayOnly ? todayTasks : tasks;
    const query = searchTerm.trim().toLowerCase();

    return [...source]
      .filter((task) => !query || task.subject.toLowerCase().includes(query) || task.topic.toLowerCase().includes(query))
      .filter((task) => !statusFilter || task.status === statusFilter)
      .filter((task) => !priorityFilter || task.priority === priorityFilter)
      .sort((a, b) => {
        if (a.status !== b.status) return a.status === "Pending" ? -1 : 1;
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.startTime.localeCompare(b.startTime);
      });
  }, [priorityFilter, searchTerm, showTodayOnly, statusFilter, tasks, todayTasks]);

  const handleCreate = useCallback(
    async (data: TaskFormData) => {
      try {
        await createTask(data);
        toast.success("Task created");
      } catch (error: any) {
        toast.error(error.message || "Failed to create task");
        throw error;
      }
    },
    [createTask]
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

  const handleStatusChange = useCallback(
    async (id: string, status: Task["status"]) => {
      try {
        await updateTaskStatus(id, status);
        toast.success("Task marked as completed");
      } catch {
        toast.error("Failed to update status");
      }
    },
    [updateTaskStatus]
  );

  return (
    <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Study Tasks</h1>
            <p className="text-muted-foreground">
              {tasks.length} total task{tasks.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant={showTodayOnly ? "default" : "outline"} size="sm" onClick={() => setShowTodayOnly((v) => !v)}>
              <Calendar className="mr-2 h-4 w-4" />
              {showTodayOnly ? "Showing Today" : "Today"}
            </Button>
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        {!showTodayOnly && (
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={[
                { value: "", label: "All Statuses" },
                { value: "Completed", label: "Completed" },
                { value: "Pending", label: "Pending" },
              ]}
              className="w-40"
            />
            <Select
              value={priorityFilter}
              onValueChange={setPriorityFilter}
              options={[
                { value: "", label: "All Priorities" },
                { value: "High", label: "High" },
                { value: "Medium", label: "Medium" },
                { value: "Low", label: "Low" },
              ]}
              className="w-40"
            />
          </div>
        )}

        {tasksError && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {tasksError}
          </div>
        )}

        {tasksLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton key={item} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : displayTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">{showTodayOnly ? "No tasks for today" : "No tasks found"}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm || statusFilter || priorityFilter
                ? "Try adjusting your filters."
                : "Create your first study task to get started."}
            </p>
            <Button size="sm" className="mt-4" onClick={() => setFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {displayTasks.map((task) => (
              <TaskCard key={task._id} task={task} onDelete={handleDelete} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}

        <TaskForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleCreate} />
    </div>
  );
}
