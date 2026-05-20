const Notification = require("../models/Notification");

const VALID_TYPES = ["reminder", "alert", "insight", "system"];

const createNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }
    if (type && !VALID_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}` });
    }

    const notification = await Notification.create({
      userId: req.user._id,
      title: title.trim(),
      message: message.trim(),
      type: type || "system",
    });

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationAsRead,
};