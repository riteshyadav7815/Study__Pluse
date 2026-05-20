const mongoose = require("mongoose");

const performanceReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    periodType: {
      type: String,
      enum: ["weekly", "monthly"],
      required: true,
    },
    periodLabel: {
      type: String,
      required: true,
    },
    completionRate: {
      type: Number,
      default: 0,
    },
    consistencyScore: {
      type: Number,
      default: 0,
    },
    efficiencyScore: {
      type: Number,
      default: 0,
    },
    overallPerformance: {
      type: Number,
      default: 0,
    },
    strongSubjects: {
      type: [String],
      default: [],
    },
    weakSubjects: {
      type: [String],
      default: [],
    },
    aiInsights: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PerformanceReport", performanceReportSchema);