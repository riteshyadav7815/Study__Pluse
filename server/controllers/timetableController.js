const Timetable = require("../models/Timetable");
const { timetableSchema } = require("../utils/validators");

const createTimetable = async (req, res) => {
  try {
    const parsed = timetableSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { day, subject, startTime, endTime, repeatWeekly, color } = parsed.data;

    // Validate that endTime is after startTime
    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    // Check for time overlap on the same day
    const overlap = await Timetable.findOne({
      userId: req.user._id,
      day,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (overlap) {
      return res.status(409).json({
        success: false,
        message: `Time slot overlaps with existing entry: ${overlap.subject} (${overlap.startTime}-${overlap.endTime})`,
      });
    }

    const entry = await Timetable.create({
      userId: req.user._id,
      day,
      subject,
      startTime,
      endTime,
      repeatWeekly: repeatWeekly || false,
      color: color || "#6366f1",
    });

    return res.status(201).json({
      success: true,
      message: "Timetable entry created successfully",
      data: entry,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getTimetables = async (req, res) => {
  try {
    const filter = { userId: req.user._id };
    if (req.query.day) filter.day = req.query.day;

    const entries = await Timetable.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateTimetable = async (req, res) => {
  try {
    const parsed = timetableSchema.partial().safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const updated = await Timetable.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      parsed.data,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Timetable entry not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Timetable updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTimetable = async (req, res) => {
  try {
    const deleted = await Timetable.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Timetable entry not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Timetable deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTimetable,
  getTimetables,
  updateTimetable,
  deleteTimetable,
};