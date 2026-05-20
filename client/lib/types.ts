export interface User {
  _id: string;
  name: string;
  email: string;
  streak: number;
  totalStudyHours: number;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  _id: string;
  userId: string;
  subject: string;
  topic: string;
  notes: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: "High" | "Medium" | "Low";
  status: "Completed" | "Pending";
  actualHours: number;
  plannedHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  subject: string;
  topic: string;
  notes?: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: "High" | "Medium" | "Low";
  plannedHours?: number;
  actualHours?: number;
}

export interface TimetableEntry {
  _id: string;
  userId: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  subject: string;
  startTime: string;
  endTime: string;
  repeatWeekly: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimetableFormData {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  subject: string;
  startTime: string;
  endTime: string;
  repeatWeekly?: boolean;
  color?: string;
}

export interface SubjectPerformance {
  subject: string;
  totalTasks: number;
  completedTasks: number;
  actualHours: number;
  plannedHours: number;
  completionRate: number;
  efficiency: number;
}

export interface DashboardAnalytics {
  summary: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    totalStudyHours: number;
    completionRate: number;
    efficiencyScore: number;
    consistencyScore: number;
    overallPerformance: number;
  };
  subjectPerformance: SubjectPerformance[];
  strongSubjects: string[];
  weakSubjects: string[];
  insights: string[];
}

export interface PerformanceReport {
  _id: string;
  userId: string;
  periodType: "weekly" | "monthly";
  periodLabel: string;
  completionRate: number;
  consistencyScore: number;
  efficiencyScore: number;
  overallPerformance: number;
  strongSubjects: string[];
  weakSubjects: string[];
  aiInsights: string[];
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "reminder" | "alert" | "insight" | "system";
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string[]>;
}
