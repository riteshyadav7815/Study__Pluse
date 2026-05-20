"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePomodoro } from "@/hooks/usePomodoro";
import { Timer, Play, Pause, RotateCcw, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export function PomodoroTimer() {
  const {
    mode,
    label,
    minutes,
    seconds,
    isRunning,
    progress,
    sessions,
    start,
    pause,
    reset,
    switchMode,
  } = usePomodoro();

  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Timer className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Pomodoro Timer</h3>
            <p className="text-xs text-muted-foreground">
              {sessions} session{sessions !== 1 ? "s" : ""} completed
            </p>
          </div>
        </div>

        {/* Timer display */}
        <div
          className={cn(
            "mb-4 flex flex-col items-center justify-center rounded-xl bg-muted/50 p-6 transition-colors",
            isRunning && "bg-primary/5"
          )}
        >
          <span className="text-5xl font-bold tracking-wider tabular-nums">{formattedTime}</span>
          <span className="mt-2 text-sm font-medium text-primary">{label}</span>
        </div>

        {/* Progress */}
        <Progress value={progress * 100} className="mb-4" />

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          {!isRunning ? (
            <Button onClick={start} size="sm" className="gap-2">
              <Play className="h-4 w-4" /> Start
            </Button>
          ) : (
            <Button onClick={pause} variant="secondary" size="sm" className="gap-2">
              <Pause className="h-4 w-4" /> Pause
            </Button>
          )}
          <Button onClick={reset} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Mode switcher */}
        <div className="mt-4 flex gap-1">
          <Button
            variant={mode === "focus" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => switchMode("focus")}
          >
            <Brain className="mr-1 h-3 w-3" />
            Focus
          </Button>
          <Button
            variant={mode === "shortBreak" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => switchMode("shortBreak")}
          >
            Short Break
          </Button>
          <Button
            variant={mode === "longBreak" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => switchMode("longBreak")}
          >
            Long Break
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
