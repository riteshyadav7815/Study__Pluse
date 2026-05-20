const StudyTask = require("../models/StudyTask");
const User = require("../models/User");
const { taskSchema } = require("../utils/validators");

const hoursBetween = (start, end) => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return Number((Math.max(eh * 60 + em - (sh * 60 + sm), 0) / 60).toFixed(2));
};

const createTask = async (req, res) => {
  try {
    const parsed = taskSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const plannedHours = hoursBetween(parsed.data.startTime, parsed.data.endTime);
    const task = await StudyTask.create({
      userId: req.user._id,
      ...parsed.data,
      status: parsed.data.status || "Pending",
      plannedHours,
      actualHours: parsed.data.status === "Completed" ? plannedHours : 0,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { userId: req.user._id };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.date) filter.date = req.query.date;
    if (req.query.priority) filter.priority = req.query.priority;

    if (req.query.search) {
      filter.$or = [
        { subject: { $regex: req.query.search, $options: "i" } },
        { topic: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const tasks = await StudyTask.find(filter)
      .sort({ date: 1, startTime: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await StudyTask.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await StudyTask.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    // Only allow status and actualHours updates (no full task edits)
    const allowedFields = {};
    if (req.body.status !== undefined) {
      const validStatuses = ["Completed", "Pending"];
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value. Must be: Completed or Pending",
        });
      }
      allowedFields.status = req.body.status;
    }
    if (req.body.actualHours !== undefined) {
      const hours = Number(req.body.actualHours);
      if (isNaN(hours) || hours < 0) {
        return res.status(400).json({
          success: false,
          message: "actualHours must be a positive number",
        });
      }
      allowedFields.actualHours = hours;
    }

    if (Object.keys(allowedFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one allowed field (status, actualHours) is required",
      });
    }

    const oldTask = await StudyTask.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!oldTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (allowedFields.status === "Completed") {
      allowedFields.actualHours =
        oldTask.plannedHours > 0 ? oldTask.plannedHours : hoursBetween(oldTask.startTime, oldTask.endTime);
    }

    if (allowedFields.status === "Pending") {
      allowedFields.actualHours = 0;
    }

    const updatedTask = await StudyTask.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      allowedFields,
      { new: true }
    );

    if (
      allowedFields.status === "Completed" &&
      oldTask.status !== "Completed" &&
      updatedTask.plannedHours > 0
    ) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { totalStudyHours: updatedTask.plannedHours },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await StudyTask.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getTodayTasks = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const tasks = await StudyTask.find({
      userId: req.user._id,
      date: today,
    }).sort({ startTime: 1 });

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTodayTasks,
};
