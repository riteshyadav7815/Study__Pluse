const express = require("express");
const {
  createTimetable,
  getTimetables,
  updateTimetable,
  deleteTimetable,
} = require("../controllers/timetableController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createTimetable).get(protect, getTimetables);
router.route("/:id").put(protect, updateTimetable).delete(protect, deleteTimetable);

module.exports = router;