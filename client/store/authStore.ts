import { create } from "zustand";
import type { User } from "@/lib/types";
import authService from "@/services/authService";
import { useTaskStore } from "@/store/taskStore";
import { useNotificationStore } from "@/store/notificationStore";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  init: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  isInitialized: false,

  init: async () => {
    if (typeof window === "undefined") {
      set({ isInitialized: true });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        set({
          token,
          user: JSON.parse(storedUser),
          isAuthenticated: true,
        });

        // Verify token is still valid by fetching profile
        try {
          const res = await authService.getProfile();
          const freshUser = res.data;
          localStorage.setItem("user", JSON.stringify(freshUser));
          set({ user: freshUser, isAuthenticated: true });
        } catch {
          // Token expired or invalid — clear auth state
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          set({ user: null, token: null, isAuthenticated: false });
        }
      }
    } catch {
      // Corrupted localStorage data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      set({ isInitialized: true });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await authService.login({ email, password });
      const { token, ...user } = res.data;
      localStorage.setItem("token", token || "");
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token: token || null, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false });
      throw new Error(err?.response?.data?.message || "Invalid credentials");
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await authService.register({ name, email, password });
      const { token, ...user } = res.data;
      localStorage.setItem("token", token || "");
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token: token || null, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false });
      const message =
        err?.response?.data?.message ||
        Object.values(err?.response?.data?.errors || {})
          .flat()
          .join(", ") ||
        "Registration failed";
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    useTaskStore.getState().clearTasks();
    useNotificationStore.getState().clearNotifications();
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    try {
      const res = await authService.getProfile();
      const freshUser = res.data;
      localStorage.setItem("user", JSON.stringify(freshUser));
      set({ user: freshUser, isAuthenticated: true });
    } catch {
      get().logout();
    }
  },
}));
