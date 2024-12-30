const express = require('express');
const router = express.Router();
const { getAssignedCourses, createCourse } = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Only allow admins to create courses
router.post('/courses', authMiddleware, roleMiddleware('admin'), createCourse);

// Professors can view their assigned courses
router.get('/courses', authMiddleware, roleMiddleware('professor'), getAssignedCourses);

module.exports = router;
