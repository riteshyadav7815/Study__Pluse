const calculateCompletionRate = (tasks) => {
  if (!tasks.length) return 0;
  const completed = tasks.filter((task) => task.status === "Completed").length;
  return Number(((completed / tasks.length) * 100).toFixed(2));
};

const calculateEfficiencyScore = (tasks) => {
  const totals = tasks.reduce(
    (acc, task) => {
      acc.actual += Number(task.actualHours || 0);
      acc.planned += Number(task.plannedHours || 0);
      return acc;
    },
    { actual: 0, planned: 0 }
  );

  if (!totals.planned) return 0;
  return Number(((totals.actual / totals.planned) * 100).toFixed(2));
};

const calculateConsistencyScore = (tasks) => {
  if (!tasks.length) return 0;

  const uniqueDays = new Set(tasks.map((task) => task.date)).size;
  const completedDays = new Set(
    tasks.filter((task) => task.status === "Completed").map((task) => task.date)
  ).size;

  if (!uniqueDays) return 0;
  return Number(((completedDays / uniqueDays) * 100).toFixed(2));
};

const calculateOverallPerformance = ({ completionRate, consistencyScore, efficiencyScore }) => {
  return Number(
    (0.5 * completionRate + 0.3 * consistencyScore + 0.2 * efficiencyScore).toFixed(2)
  );
};

const getSubjectWisePerformance = (tasks) => {
  const subjectMap = {};

  tasks.forEach((task) => {
    if (!subjectMap[task.subject]) {
      subjectMap[task.subject] = {
        subject: task.subject,
        totalTasks: 0,
        completedTasks: 0,
        actualHours: 0,
        plannedHours: 0,
      };
    }

    subjectMap[task.subject].totalTasks += 1;
    if (task.status === "Completed") subjectMap[task.subject].completedTasks += 1;
    subjectMap[task.subject].actualHours += Number(task.actualHours || 0);
    subjectMap[task.subject].plannedHours += Number(task.plannedHours || 0);
  });

  return Object.values(subjectMap).map((item) => ({
    ...item,
    completionRate: item.totalTasks
      ? Number(((item.completedTasks / item.totalTasks) * 100).toFixed(2))
      : 0,
    efficiency: item.plannedHours
      ? Number(((item.actualHours / item.plannedHours) * 100).toFixed(2))
      : 0,
  }));
};

const getStrongAndWeakSubjects = (subjectPerformance) => {
  const sorted = [...subjectPerformance].sort((a, b) => b.completionRate - a.completionRate);
  return {
    strongSubjects: sorted.slice(0, 3).map((item) => item.subject),
    weakSubjects: sorted.slice(-3).map((item) => item.subject),
  };
};

module.exports = {
  calculateCompletionRate,
  calculateEfficiencyScore,
  calculateConsistencyScore,
  calculateOverallPerformance,
  getSubjectWisePerformance,
  getStrongAndWeakSubjects,
};