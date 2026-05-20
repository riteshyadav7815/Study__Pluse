"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./Sidebar";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setDropdownOpen(false);
    }

    if (dropdownOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [dropdownOpen]);

  const handleLogout = useCallback(() => {
    setDropdownOpen(false);
    logout();
    router.push("/login");
  }, [logout, router]);

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const displayName = user?.name || "User";
  const displayEmail = user?.email || "";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background px-3 sm:px-4 lg:px-6">
      <MobileNav />
      <div className="min-w-0 flex-1" />

      <div className="flex min-w-0 items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" className="hidden h-11 w-11 text-muted-foreground sm:inline-flex sm:h-10 sm:w-10" aria-label="Search">
          <Search className="h-5 w-5" />
        </Button>

        <Link href="/settings">
          <Button variant="ghost" size="icon" className="relative h-11 w-11 text-muted-foreground sm:h-10 sm:w-10" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </Link>

        {user && user.streak > 0 && (
          <div className="hidden items-center rounded-full bg-primary/10 px-3 py-1.5 md:flex">
            <span className="text-sm font-semibold text-primary">{user.streak} day streak</span>
          </div>
        )}

        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              className="flex min-h-11 max-w-[160px] items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent sm:min-h-10 sm:max-w-[220px]"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {userInitial}
              </div>
              <div className="hidden min-w-0 text-left sm:block">
                <p className="truncate text-sm font-medium leading-tight">{displayName}</p>
              </div>
              <ChevronDown
                className={`hidden h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform sm:block ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-lg border bg-popover p-1 shadow-lg">
                <div className="mb-1 flex items-center gap-3 border-b px-3 py-2.5">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {userInitial}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{displayName}</p>
                    <p className="max-w-[240px] truncate text-xs text-muted-foreground">{displayEmail}</p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <div className="my-1 border-t" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
