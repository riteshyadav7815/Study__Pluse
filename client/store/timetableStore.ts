import { create } from "zustand";
import type { TimetableEntry } from "@/lib/types";
import timetableService from "@/services/timetableService";

interface TimetableState {
  entries: TimetableEntry[];
  isLoading: boolean;
  error: string | null;

  fetchEntries: (day?: string) => Promise<void>;
  createEntry: (data: Parameters<typeof timetableService.create>[0]) => Promise<void>;
  updateEntry: (id: string, data: Parameters<typeof timetableService.update>[1]) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

export const useTimetableStore = create<TimetableState>((set) => ({
  entries: [],
  isLoading: false,
  error: null,

  fetchEntries: async (day) => {
    set({ isLoading: true, error: null });
    try {
      const res = await timetableService.getAll(day);
      set({ entries: res.data, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err?.response?.data?.message || "Failed to fetch timetable" });
    }
  },

  createEntry: async (data) => {
    try {
      const res = await timetableService.create(data);
      set((state) => ({ entries: [...state.entries, res.data] }));
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Failed to create timetable entry");
    }
  },

  updateEntry: async (id, data) => {
    try {
      const res = await timetableService.update(id, data);
      set((state) => ({
        entries: state.entries.map((e) => (e._id === id ? res.data : e)),
      }));
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Failed to update entry");
    }
  },

  deleteEntry: async (id) => {
    try {
      await timetableService.delete(id);
      set((state) => ({
        entries: state.entries.filter((e) => e._id !== id),
      }));
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Failed to delete entry");
    }
  },
}));