import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string to a readable format */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Format time to 12-hour format */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

/** Get today's date as YYYY-MM-DD */
export function getToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Get the current week number */
export function getWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
}

/** Get array of last N days for heatmap */
export function getLastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

/** Truncate text with ellipsis */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/** Calculate hours between two time strings */
export function hoursBetween(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const minutes = eh * 60 + em - (sh * 60 + sm);
  return Number((Math.max(minutes, 0) / 60).toFixed(2));
}

/** Subject color mapping */
export const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "#6366f1",
  Physics: "#8b5cf6",
  Chemistry: "#06b6d4",
  Biology: "#10b981",
  "Computer Science": "#f59e0b",
  English: "#ef4444",
  History: "#ec4899",
  Geography: "#14b8a6",
  Economics: "#f97316",
  default: "#6366f1",
};

/** Get color for a subject */
export function getSubjectColor(subject: string): string {
  return SUBJECT_COLORS[subject] || SUBJECT_COLORS.default;
}

/** Priority badge variants */
export const PRIORITY_CONFIG = {
  High: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  Medium: { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  Low: { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
} as const;

/** Status badge variants */
export const STATUS_CONFIG = {
  Completed: { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  Pending: { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
} as const;

/** Days of week */
export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
