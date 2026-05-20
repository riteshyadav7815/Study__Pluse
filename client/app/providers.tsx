"use client";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import { useAuthStore } from "@/store/authStore";
import { useTaskStore } from "@/store/taskStore";
import { useNotificationStore } from "@/store/notificationStore";

function AppDataBootstrap() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const init = useAuthStore((state) => state.init);
  const fetchTasksOnce = useTaskStore((state) => state.fetchTasksOnce);
  const fetchNotificationsOnce = useNotificationStore((state) => state.fetchNotificationsOnce);

  useEffect(() => {
    if (!isInitialized) {
      init();
    }
  }, [init, isInitialized]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchTasksOnce();
      fetchNotificationsOnce();
    }
  }, [fetchNotificationsOnce, fetchTasksOnce, isAuthenticated, isInitialized]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AppDataBootstrap />
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
        }}
      />
    </ThemeProvider>
  );
}
