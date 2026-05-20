import { create } from "zustand";
import type { Notification } from "@/lib/types";
import notificationService from "@/services/notificationService";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  hasFetched: boolean;
  fetchNotificationsOnce: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  hasFetched: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await notificationService.getAll();
      set({
        notifications: res.data,
        unreadCount: res.data.filter((notification) => !notification.isRead).length,
        hasFetched: true,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false, hasFetched: true });
    }
  },

  fetchNotificationsOnce: async () => {
    const { hasFetched, isLoading, fetchNotifications } = get();
    if (hasFetched || isLoading) return;
    await fetchNotifications();
  },

  markAsRead: async (id: string) => {
    await notificationService.markAsRead(id);
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification._id === id ? { ...notification, isRead: true } : notification
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  clearNotifications: () =>
    set({ notifications: [], unreadCount: 0, isLoading: false, hasFetched: false }),
}));
