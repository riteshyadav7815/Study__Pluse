"use client";

import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-background">
      <div className="hidden lg:block">
        <Sidebar isOpen={false} onClose={() => {}} mode="desktop" />
      </div>
      <div className="min-w-0 lg:pl-[260px]">
        <Navbar />
        <main className="min-h-[calc(100dvh-64px)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-6 sm:p-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
