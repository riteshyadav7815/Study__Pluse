const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    repeatWeekly: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: "#6366f1",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timetable", timetableSchema);