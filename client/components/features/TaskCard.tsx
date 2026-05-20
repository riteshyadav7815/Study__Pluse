"use client";

import React, { useState } from "react";
import { Calendar, Clock, Trash2, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, PRIORITY_CONFIG, STATUS_CONFIG, formatDate, formatTime } from "@/lib/utils";
import { getPlannedHours } from "@/lib/taskAnalytics";
import type { Task } from "@/lib/types";

interface Props {
  task: Task;
  onDelete?: (id: string) => Promise<void>;
  onStatusChange?: (id: string, status: Task["status"]) => Promise<void>;
  isBusy?: boolean;
}

function TaskCardComponent({ task, onDelete, onStatusChange, isBusy = false }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isCompleted = task.status === "Completed";
  const plannedHours = getPlannedHours(task);

  const handleMarkComplete = async () => {
    if (isUpdating || isBusy || isCompleted) return;
    setIsUpdating(true);
    try {
      await onStatusChange?.(task._id, "Completed");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className={cn("relative overflow-hidden transition-shadow hover:shadow-md", isCompleted && "opacity-75")}>
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1",
          task.priority === "High" && "bg-red-500",
          task.priority === "Medium" && "bg-amber-500",
          task.priority === "Low" && "bg-emerald-500"
        )}
      />

      <CardContent className="p-4">
        <div className="min-w-0">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="truncate font-semibold">{task.subject}</h4>
              <p className="truncate text-sm text-muted-foreground">{task.topic}</p>
            </div>
            <Badge
              className={cn(
                "shrink-0",
                STATUS_CONFIG[task.status].bg,
                STATUS_CONFIG[task.status].color,
                STATUS_CONFIG[task.status].border
              )}
            >
              {isCompleted && <CheckCircle2 className="mr-1 h-3 w-3" />}
              {task.status}
            </Badge>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(task.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(task.startTime)} - {formatTime(task.endTime)}
            </span>
          </div>

          {task.notes && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{task.notes}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge
              className={cn(
                PRIORITY_CONFIG[task.priority].bg,
                PRIORITY_CONFIG[task.priority].color,
                PRIORITY_CONFIG[task.priority].border
              )}
            >
              {task.priority}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {isCompleted ? plannedHours.toFixed(1) : "0.0"} / {plannedHours.toFixed(1)}h counted
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {!isCompleted && (
              <Button size="sm" onClick={handleMarkComplete} isLoading={isUpdating || isBusy}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark Completed
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => onDelete?.(task._id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const TaskCard = React.memo(TaskCardComponent);
