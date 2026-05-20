const express = require("express");
const {
  getDashboardAnalytics,
  generateReport,
  getReports,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", protect, getDashboardAnalytics);
router.post("/report", protect, generateReport);
router.get("/reports", protect, getReports);

module.exports = router;