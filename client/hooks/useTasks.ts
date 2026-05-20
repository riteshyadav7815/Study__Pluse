"use client";

import { useCallback, useMemo } from "react";
import { useTaskStore } from "@/store/taskStore";
import { getToday } from "@/lib/utils";

export function useTasks() {
  const store = useTaskStore();
  const todayTasks = useMemo(
    () => store.tasks.filter((task) => task.date === getToday()),
    [store.tasks]
  );

  const refreshAll = useCallback(async () => {
    await store.fetchTasks();
  }, [store.fetchTasks]);

  return { ...store, todayTasks, mounted: true, refreshAll };
}
