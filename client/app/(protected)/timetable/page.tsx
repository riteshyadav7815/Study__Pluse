"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { TimetableGrid } from "@/components/features/TimetableGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function getWeekBounds(date = new Date()) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export default function TimetablePage() {
  const { tasks, isLoading } = useTasks();

  const weekTasks = useMemo(() => {
    const { start, end } = getWeekBounds();
    return tasks.filter((task) => {
      const taskDate = new Date(`${task.date}T00:00:00`);
      return taskDate >= start && taskDate <= end;
    });
  }, [tasks]);

  return (
    <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Weekly Timetable</h1>
            <p className="text-muted-foreground">
              Built automatically from your study tasks for this week.
            </p>
          </div>
          <Link href="/tasks">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </Link>
        </div>

        {isLoading ? <Skeleton className="h-[600px] w-full rounded-xl" /> : <TimetableGrid tasks={weekTasks} />}
    </div>
  );
}
