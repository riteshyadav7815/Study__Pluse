"use client";

import { Badge } from "@/components/ui/badge";
import { cn, formatTime, STATUS_CONFIG } from "@/lib/utils";
import type { Task } from "@/lib/types";

const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 7;
  return `${hour.toString().padStart(2, "0")}:00`;
});

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function getTopOffset(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return Math.max((h - 7) * 60 + m, 0);
}

function getHeight(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return Math.max((eh - sh) * 60 + (em - sm), 40);
}

function getTaskDay(task: Task) {
  return new Date(`${task.date}T00:00:00`).toLocaleDateString("en-US", { weekday: "long" });
}

interface Props {
  tasks: Task[];
}

export function TimetableGrid({ tasks }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <div className="grid grid-cols-8 border-b bg-muted/50" style={{ minWidth: "920px" }}>
        <div className="border-r p-3 text-center text-sm font-medium text-muted-foreground">Time</div>
        {DAYS.map((day) => (
          <div key={day} className="border-r p-3 text-center text-sm font-semibold last:border-r-0">
            {day.slice(0, 3)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-8" style={{ minHeight: `${14 * 60}px`, minWidth: "920px" }}>
        <div className="relative border-r">
          {TIME_SLOTS.map((time) => (
            <div
              key={time}
              className="absolute left-0 w-full border-t px-2 text-xs text-muted-foreground"
              style={{ top: `${getTopOffset(time)}px`, height: "60px" }}
            >
              {formatTime(time)}
            </div>
          ))}
        </div>

        {DAYS.map((day) => (
          <div key={day} className="relative border-r last:border-r-0">
            {TIME_SLOTS.map((time) => (
              <div
                key={time}
                className="absolute left-0 w-full border-t border-muted"
                style={{ top: `${getTopOffset(time)}px`, height: "60px" }}
              />
            ))}

            {tasks
              .filter((task) => getTaskDay(task) === day)
              .map((task) => (
                <div
                  key={task._id}
                  className={cn(
                    "absolute left-1 right-1 overflow-hidden rounded-md border-l-4 bg-background p-2 text-xs shadow-sm",
                    task.status === "Completed" ? "border-emerald-500" : "border-primary"
                  )}
                  style={{
                    top: `${getTopOffset(task.startTime)}px`,
                    height: `${getHeight(task.startTime, task.endTime)}px`,
                  }}
                >
                  <p className="truncate font-semibold">{task.subject}</p>
                  <p className="truncate text-muted-foreground">{task.topic}</p>
                  <p className="truncate text-muted-foreground">
                    {formatTime(task.startTime)} - {formatTime(task.endTime)}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "mt-1 text-[10px]",
                      STATUS_CONFIG[task.status].bg,
                      STATUS_CONFIG[task.status].color,
                      STATUS_CONFIG[task.status].border
                    )}
                  >
                    {task.status}
                  </Badge>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
