"use client";

import { useState, useMemo } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";
import { cn, formatDate, getToday, PRIORITY_CONFIG, STATUS_CONFIG } from "@/lib/utils";
import type { Task } from "@/lib/types";
import Link from "next/link";

export default function CalendarPage() {
  const { tasks, isLoading: tasksLoading } = useTasks();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(getToday());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const monthLabel = new Date(currentYear, currentMonth).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const formatDateKey = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  };

  const today = getToday();
  const isToday = (day: number) => formatDateKey(day) === today;

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Group tasks by date for the calendar
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((task) => {
      if (!map[task.date]) map[task.date] = [];
      map[task.date].push(task);
    });
    return map;
  }, [tasks]);

  // Tasks for the selected date
  const selectedTasks = tasksByDate[selectedDate] || [];

  // Status counts for calendar dots
  const getDayStatusIndicator = (dateKey: string) => {
    const dayTasks = tasksByDate[dateKey];
    if (!dayTasks || dayTasks.length === 0) return null;
    const hasMissed = dateKey < today && dayTasks.some((t) => t.status === "Pending");
    const hasCompleted = dayTasks.some((t) => t.status === "Completed");
    const allDone = dayTasks.every((t) => t.status === "Completed");
    if (hasMissed) return "missed";
    if (allDone) return "all-done";
    if (hasCompleted) return "mixed";
    return "pending";
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Calendar</h1>
            <p className="text-muted-foreground">
              View your study schedule — {tasks.length} tasks loaded
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>{monthLabel}</CardTitle>
                <CardDescription>Select a date to view tasks</CardDescription>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {dayNames.map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs font-medium text-muted-foreground py-2"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7">
                {/* Empty cells before first day */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateKey = formatDateKey(day);
                  const isSelected = dateKey === selectedDate;
                  const dayIsToday = isToday(day);
                  const indicator = getDayStatusIndicator(dateKey);
                  const taskCount = (tasksByDate[dateKey] || []).length;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(dateKey)}
                      className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all hover:bg-muted ${
                        isSelected
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : dayIsToday
                          ? "bg-primary/10 text-primary font-semibold"
                          : ""
                      }`}
                    >
                      <span>{day}</span>
                      {taskCount > 0 && (
                        <div className="flex gap-0.5 mt-0.5">
                          {indicator === "all-done" && (
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          )}
                          {indicator === "mixed" && (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            </>
                          )}
                          {indicator === "pending" && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                          {indicator === "missed" && (
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          )}
                        </div>
                      )}
                      {dayIsToday && !isSelected && taskCount === 0 && (
                        <span className="mt-0.5 h-1 w-1 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Day Card — now shows real tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
              <CardDescription>
                {selectedDate === today
                  ? `Today's tasks — ${selectedTasks.length} scheduled`
                  : `${selectedTasks.length} task${selectedTasks.length !== 1 ? "s" : ""} scheduled`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : selectedTasks.length === 0 ? (
                <div className="space-y-4">
                  <div className="rounded-lg border bg-muted/30 p-4 text-center">
                    <CalendarIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">No tasks for this date</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add tasks from the Tasks page
                    </p>
                    <Link href="/tasks" className="mt-3 inline-block">
                      <Button size="sm" variant="outline">Go to Tasks</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedTasks
                    .slice()
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((task) => {
                      const statusConf = STATUS_CONFIG[task.status];
                      const priorityConf = PRIORITY_CONFIG[task.priority];
                      const isMissed = task.date < today && task.status === "Pending";
                      return (
                        <div
                          key={task._id}
                          className="cursor-pointer rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50"
                          onClick={() => setSelectedTask(task)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold truncate">{task.subject}</p>
                              <p className="text-xs text-muted-foreground truncate">{task.topic}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs shrink-0",
                                isMissed
                                  ? "border-red-500/20 bg-red-500/10 text-red-500"
                                  : [statusConf.color, statusConf.bg, statusConf.border]
                              )}
                            >
                              {task.status === "Completed" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                              {task.status === "Pending" && <Clock3 className="mr-1 h-3 w-3" />}
                              {isMissed && <AlertTriangle className="mr-1 h-3 w-3" />}
                              {isMissed ? "Missed" : task.status}
                            </Badge>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.startTime} - {task.endTime}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn("text-[10px] py-0", priorityConf.color, priorityConf.bg, priorityConf.border)}
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          {task.notes && (
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                              {task.notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          title={selectedTask?.subject || "Task"}
          description={selectedTask?.topic}
        >
          {selectedTask && (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                {formatDate(selectedTask.date)} - {selectedTask.startTime} - {selectedTask.endTime}
              </p>
              <Badge
                variant="outline"
                className={cn(
                  STATUS_CONFIG[selectedTask.status].color,
                  STATUS_CONFIG[selectedTask.status].bg,
                  STATUS_CONFIG[selectedTask.status].border
                )}
              >
                {selectedTask.date < today && selectedTask.status === "Pending" ? "Missed" : selectedTask.status}
              </Badge>
              {selectedTask.notes && <p className="rounded-md bg-muted/50 p-3">{selectedTask.notes}</p>}
            </div>
          )}
        </Dialog>
    </div>
  );
}
