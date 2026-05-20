"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart3,
  User,
  Settings,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/store/notificationStore";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/timetable", label: "Timetable", icon: Clock },
  { href: "/tasks", label: "Study Tasks", icon: CheckSquare },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "desktop" | "mobile";
}

export function Sidebar({ isOpen, onClose, mode = "desktop" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const prefetchRoutes = () => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      NAV_ITEMS.forEach((item) => router.prefetch(item.href));
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(prefetchRoutes);
      return () => window.cancelIdleCallback(id);
    }

    const id = globalThis.setTimeout(prefetchRoutes, 500);
    return () => globalThis.clearTimeout(id);
  }, [router]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = mounted && theme === "dark";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-dvh w-[260px] max-w-[85vw] flex-col overflow-hidden border-r bg-card transition-transform duration-200 will-change-transform",
          mode === "desktop" && "translate-x-0",
          mode === "mobile" && (isOpen ? "translate-x-0" : "pointer-events-none -translate-x-full")
        )}
        aria-hidden={mode === "mobile" && !isOpen}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">SP</span>
          </div>
          <Link href="/dashboard" className="text-xl font-bold tracking-tight">
            Study<span className="text-primary">Pulse</span>
          </Link>
          <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                onClick={onClose}
                prefetch={mode === "desktop"}
                onMouseEnter={() => {
                  if (mode === "desktop") router.prefetch(item.href);
                }}
                onFocus={() => {
                  if (mode === "desktop") router.prefetch(item.href);
                }}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.href === "/dashboard" && unreadCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User & actions */}
        <div className="shrink-0 space-y-2 border-t p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.name || "User"}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={isDark ? "Light mode" : "Dark mode"}
              className="flex-1"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link href="/settings" className="flex-1">
              <Button variant="ghost" size="icon" className="w-full" as-child>
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="flex-1 text-destructive hover:text-destructive"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

export function MobileNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="h-11 w-11"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} mode="mobile" />
    </div>
  );
}
