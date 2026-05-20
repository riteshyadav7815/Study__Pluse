const express = require("express");
const {
  createNotification,
  getNotifications,
  markNotificationAsRead,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createNotification).get(protect, getNotifications);
router.patch("/:id/read", protect, markNotificationAsRead);

module.exports = router;