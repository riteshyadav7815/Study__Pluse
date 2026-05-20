"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isInitialized, login, register, logout, init, loadUser } =
    useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    if (!isInitialized) {
      init();
    }
  }, [init, isInitialized]);

  // Protect routes
  useEffect(() => {
    if (isInitialized && !isLoading && requireAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isInitialized, isLoading, isAuthenticated, requireAuth, router]);

  return { user, isAuthenticated, isLoading: isLoading || !isInitialized, login, register, logout, loadUser };
}