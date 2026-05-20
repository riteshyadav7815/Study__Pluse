"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getLastNDays, cn } from "@/lib/utils";

interface Props {
  taskDates: string[];
  isLoading?: boolean;
}

export function StudyHeatmap({ taskDates, isLoading }: Props) {
  const days = useMemo(() => getLastNDays(84), []);
  const countsByDate = useMemo(() => {
    return taskDates.reduce<Record<string, number>>((acc, date) => {
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  }, [taskDates]);

  const weeks = useMemo(() => {
    const result: string[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  const getHeatLevel = (date: string) => Math.min(countsByDate[date] || 0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, j) => (
                  <div key={j} className="skeleton h-3 w-3 rounded-sm" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1 overflow-x-auto">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day) => (
                  <div
                    key={day}
                    className={cn(
                      "h-3 w-3 rounded-sm transition-colors",
                      `heatmap-${getHeatLevel(day)}`
                    )}
                    title={`${day}: ${countsByDate[day] || 0} tasks`}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div key={level} className={cn("h-3 w-3 rounded-sm", `heatmap-${level}`)} />
          ))}
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
