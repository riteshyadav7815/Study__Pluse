"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type TimerMode = "focus" | "shortBreak" | "longBreak";

const DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const LABELS: Record<TimerMode, string> = {
  focus: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export function usePomodoro() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [isRunning, clearTimer]);

  const pause = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
  }, [mode, clearTimer]);

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      clearTimer();
      setIsRunning(false);
      setMode(newMode);
      setTimeLeft(DURATIONS[newMode]);
    },
    [clearTimer]
  );

  // Auto-advance sessions
  useEffect(() => {
    if (timeLeft === 0 && mode === "focus") {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      if (newSessions % 4 === 0) {
        switchMode("longBreak");
      } else {
        switchMode("shortBreak");
      }
    }
  }, [timeLeft, mode, sessions, switchMode]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - timeLeft / DURATIONS[mode];

  return {
    mode,
    label: LABELS[mode],
    minutes,
    seconds,
    isRunning,
    progress,
    sessions,
    DURATIONS,
    start,
    pause,
    reset,
    switchMode,
  };
}