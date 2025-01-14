const express = require("express");
const router = express.Router();
const {
  getAssignedCourses,
  createCourse,
} = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Only allow admins to create courses
//router.post('/courses', authMiddleware, roleMiddleware('admin'), createCourse);
router.post("/course", authMiddleware, createCourse);

// Professors can view their assigned courses
//router.get('/courses', authMiddleware, roleMiddleware('professor'), getAssignedCourses);
router.get("/course", authMiddleware, getAssignedCourses);
module.exports = router;
