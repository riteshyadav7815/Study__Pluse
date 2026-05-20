const StudyTask = require("../models/StudyTask");
const PerformanceReport = require("../models/PerformanceReport");
const {
  calculateCompletionRate,
  calculateEfficiencyScore,
  calculateConsistencyScore,
  calculateOverallPerformance,
  getSubjectWisePerformance,
  getStrongAndWeakSubjects,
} = require("../analytics/performanceCalculator");

const buildInsights = ({ weakSubjects, strongSubjects, completionRate, consistencyScore, efficiencyScore }) => {
  const insights = [];

  if (weakSubjects.length) insights.push(`Focus more on ${weakSubjects[0]} — it appears to be a weak subject.`);
  if (strongSubjects.length) insights.push(`${strongSubjects[0]} is currently your strongest subject.`);
  if (completionRate < 60) insights.push("Your task completion rate is low. Try breaking tasks into smaller sessions.");
  if (consistencyScore >= 70) insights.push("Great job — your study consistency is improving.");
  if (efficiencyScore < 75) insights.push("Your actual study time is below planned time. Improve time discipline.");

  return insights;
};

const getDashboardAnalytics = async (req, res) => {
  try {
    const tasks = await StudyTask.find({ userId: req.user._id });

    const completionRate = calculateCompletionRate(tasks);
    const efficiencyScore = calculateEfficiencyScore(tasks);
    const consistencyScore = calculateConsistencyScore(tasks);
    const overallPerformance = calculateOverallPerformance({
      completionRate,
      consistencyScore,
      efficiencyScore,
    });
    const subjectPerformance = getSubjectWisePerformance(tasks);
    const { strongSubjects, weakSubjects } = getStrongAndWeakSubjects(subjectPerformance);

    const totalStudyHours = tasks.reduce((sum, task) => sum + Number(task.actualHours || 0), 0);
    const completedTasks = tasks.filter((task) => task.status === "Completed").length;
    const pendingTasks = tasks.filter((task) => task.status === "Pending").length;

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalTasks: tasks.length,
          completedTasks,
          pendingTasks,
          totalStudyHours,
          completionRate,
          efficiencyScore,
          consistencyScore,
          overallPerformance,
        },
        subjectPerformance,
        strongSubjects,
        weakSubjects,
        insights: buildInsights({
          weakSubjects,
          strongSubjects,
          completionRate,
          consistencyScore,
          efficiencyScore,
        }),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const generateReport = async (req, res) => {
  try {
    const periodType = req.query.periodType || "weekly";
    const periodLabel = req.query.periodLabel || "Current Period";

    const tasks = await StudyTask.find({ userId: req.user._id });

    const completionRate = calculateCompletionRate(tasks);
    const efficiencyScore = calculateEfficiencyScore(tasks);
    const consistencyScore = calculateConsistencyScore(tasks);
    const overallPerformance = calculateOverallPerformance({
      completionRate,
      consistencyScore,
      efficiencyScore,
    });
    const subjectPerformance = getSubjectWisePerformance(tasks);
    const { strongSubjects, weakSubjects } = getStrongAndWeakSubjects(subjectPerformance);
    const aiInsights = buildInsights({
      weakSubjects,
      strongSubjects,
      completionRate,
      consistencyScore,
      efficiencyScore,
    });

    const report = await PerformanceReport.create({
      userId: req.user._id,
      periodType,
      periodLabel,
      completionRate,
      consistencyScore,
      efficiencyScore,
      overallPerformance,
      strongSubjects,
      weakSubjects,
      aiInsights,
    });

    return res.status(201).json({
      success: true,
      message: "Performance report generated successfully",
      data: report,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await PerformanceReport.find({ userId: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardAnalytics,
  generateReport,
  getReports,
};
