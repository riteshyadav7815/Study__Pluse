import type { Task } from "@/lib/types";
import { getToday, hoursBetween } from "@/lib/utils";

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getPlannedHours(task: Task): number {
  return task.plannedHours > 0 ? task.plannedHours : hoursBetween(task.startTime, task.endTime);
}

export function getTaskStats(tasks: Task[]) {
  const today = getToday();
  const todayTasks = tasks.filter((task) => task.date === today);
  const todayCompleted = todayTasks.filter((task) => task.status === "Completed");
  const completedTasks = tasks.filter((task) => task.status === "Completed");

  const plannedHoursToday = todayTasks.reduce((sum, task) => sum + getPlannedHours(task), 0);
  const completedStudyHoursToday = todayCompleted.reduce((sum, task) => sum + getPlannedHours(task), 0);
  const totalCompletedStudyHours = completedTasks.reduce((sum, task) => sum + getPlannedHours(task), 0);
  const completionRate =
    todayTasks.length > 0 ? Math.round((todayCompleted.length / todayTasks.length) * 100) : 0;

  return {
    todayTasks,
    plannedHoursToday,
    completedStudyHoursToday,
    totalCompletedStudyHours,
    completionRate,
    completedTasks,
    pendingTasks: tasks.filter((task) => task.status === "Pending"),
  };
}

export function sortTasksForDashboard(tasks: Task[]) {
  const today = getToday();
  return [...tasks].sort((a, b) => {
    const aBucket = a.status === "Completed" ? 2 : a.date === today ? 0 : 1;
    const bBucket = b.status === "Completed" ? 2 : b.date === today ? 0 : 1;
    if (aBucket !== bBucket) return aBucket - bBucket;
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });
}

export function getStudyStreak(tasks: Task[]) {
  const completedDates = new Set(
    tasks.filter((task) => task.status === "Completed").map((task) => task.date)
  );
  let streak = 0;
  const day = new Date(`${getToday()}T00:00:00`);

  while (completedDates.has(formatLocalDate(day))) {
    streak += 1;
    day.setDate(day.getDate() - 1);
  }

  return streak;
}

export function getSubjectPerformance(tasks: Task[]) {
  const subjectMap = tasks.reduce<
    Record<
      string,
      {
        subject: string;
        totalTasks: number;
        completedTasks: number;
        actualHours: number;
        plannedHours: number;
      }
    >
  >((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = {
        subject: task.subject,
        totalTasks: 0,
        completedTasks: 0,
        actualHours: 0,
        plannedHours: 0,
      };
    }

    const plannedHours = getPlannedHours(task);
    acc[task.subject].totalTasks += 1;
    acc[task.subject].plannedHours += plannedHours;
    if (task.status === "Completed") {
      acc[task.subject].completedTasks += 1;
      acc[task.subject].actualHours += plannedHours;
    }
    return acc;
  }, {});

  return Object.values(subjectMap).map((subject) => ({
    ...subject,
    completionRate: subject.totalTasks
      ? Number(((subject.completedTasks / subject.totalTasks) * 100).toFixed(2))
      : 0,
    efficiency: subject.plannedHours
      ? Number(((subject.actualHours / subject.plannedHours) * 100).toFixed(2))
      : 0,
  }));
}

export function getStrongAndWeakSubjects(tasks: Task[]) {
  const subjectPerformance = getSubjectPerformance(tasks);
  const sorted = [...subjectPerformance].sort((a, b) => b.completionRate - a.completionRate);
  return {
    strongSubjects: sorted.filter((subject) => subject.totalTasks > 0).slice(0, 3).map((subject) => subject.subject),
    weakSubjects: sorted
      .filter((subject) => subject.totalTasks > 0 && subject.completionRate < 70)
      .slice(-3)
      .map((subject) => subject.subject),
  };
}

export function getAnalyticsInsights(tasks: Task[]) {
  const stats = getTaskStats(tasks);
  const { strongSubjects, weakSubjects } = getStrongAndWeakSubjects(tasks);
  const insights: string[] = [];

  if (weakSubjects.length) insights.push(`Focus more on ${weakSubjects[0]} - it needs more completed sessions.`);
  if (strongSubjects.length) insights.push(`${strongSubjects[0]} is currently your strongest subject.`);
  if (stats.completionRate < 60 && stats.todayTasks.length > 0) {
    insights.push("Today's completion rate is low. Prioritize the shortest pending session first.");
  }
  if (stats.totalCompletedStudyHours === 0) {
    insights.push("Study hours are counted after tasks are marked completed.");
  }

  return insights;
}
