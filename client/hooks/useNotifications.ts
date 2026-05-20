"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";

export function useNotifications() {
  const store = useNotificationStore();

  useEffect(() => {
    store.fetchNotificationsOnce();
  }, [store.fetchNotificationsOnce]);

  return store;
}
