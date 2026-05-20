"use client";

import { useEffect, useState } from "react";
import { useTimetableStore } from "@/store/timetableStore";

export function useTimetable(day?: string) {
  const [mounted, setMounted] = useState(false);
  const store = useTimetableStore();

  useEffect(() => {
    setMounted(true);
    store.fetchEntries(day);
  }, [day]);

  return { ...store, mounted };
}