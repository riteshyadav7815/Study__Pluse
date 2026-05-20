"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  BellRing,
  Sun,
  Moon,
  Monitor,
  Trash2,
  CheckCheck,
  HelpCircle,
  FileText,
  Info,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, logout } = useAuth(false);
  const {
    notifications,
    isLoading: notificationsLoading,
    fetchNotifications,
    markAsRead,
  } = useNotifications();

  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    // Read current theme
    const stored = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
    if (stored) {
      setTheme(stored);
    } else if (typeof document !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    }
  }, []);

  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    const root = document.documentElement;

    if (newTheme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
      localStorage.removeItem("theme");
    } else {
      root.classList.toggle("dark", newTheme === "dark");
      localStorage.setItem("theme", newTheme);
    }

    toast.success(`Theme set to ${newTheme}`);
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      const unread = notifications.filter((n) => !n.isRead);
      for (const n of unread) {
        await markAsRead(n._id);
      }
      toast.success("All notifications marked as read");
      fetchNotifications();
    } catch {
      toast.error("Failed to update notifications");
    } finally {
      setMarkingAll(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <Bell className="h-4 w-4 text-blue-500" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "insight":
        return <Lightbulb className="h-4 w-4 text-amber-500" />;
      case "system":
        return <Info className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
          <p className="text-muted-foreground">
            Customize your StudyPulse experience
          </p>
        </div>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appearance</CardTitle>
            <CardDescription>
              Choose your preferred theme for the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => applyTheme("light")}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:bg-muted/50 ${
                  theme === "light"
                    ? "border-primary bg-primary/5"
                    : "border-transparent"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                  <Sun className="h-5 w-5 text-amber-600" />
                </div>
                <span className="text-sm font-medium">Light</span>
              </button>

              <button
                onClick={() => applyTheme("dark")}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:bg-muted/50 ${
                  theme === "dark"
                    ? "border-primary bg-primary/5"
                    : "border-transparent"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800">
                  <Moon className="h-5 w-5 text-indigo-400" />
                </div>
                <span className="text-sm font-medium">Dark</span>
              </button>

              <button
                onClick={() => applyTheme("system")}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:bg-muted/50 ${
                  theme === "system"
                    ? "border-primary bg-primary/5"
                    : "border-transparent"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-slate-800">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Notifications</CardTitle>
              <CardDescription>
                View and manage your notifications
              </CardDescription>
            </div>
            {notifications.some((n) => !n.isRead) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                isLoading={markingAll}
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark All Read
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {notificationsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <BellRing className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="font-medium">No notifications</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You're all caught up! Notifications will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                      !notification.isRead
                        ? "bg-primary/5 border-primary/20"
                        : ""
                    }`}
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{notification.title}</p>
                        {!notification.isRead && (
                          <Badge
                            variant="default"
                            className="h-5 px-1.5 text-[10px]"
                          >
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          markAsRead(notification._id);
                          toast.success("Marked as read");
                        }}
                        className="shrink-0"
                      >
                        Mark Read
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About StudyPulse</CardTitle>
            <CardDescription>
              Information about the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Version</p>
                  <p className="text-xs text-muted-foreground">1.0.0</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Need help?</p>
                  <p className="text-xs text-muted-foreground">
                    Check out the documentation or contact support
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Support
              </Button>
            </div>

            {/* Danger Zone */}
            <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-destructive">Sign Out</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Log out of your account on this device
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    logout();
                    toast.success("Signed out successfully");
                    window.location.href = "/login";
                  }}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
