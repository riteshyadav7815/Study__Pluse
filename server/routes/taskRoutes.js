const express = require("express");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTodayTasks,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createTask).get(protect, getTasks);
router.get("/today", protect, getTodayTasks);
router.route("/:id").get(protect, getTaskById).put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;