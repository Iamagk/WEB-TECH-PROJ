const express = require('express');
const router = express.Router();
const{getAssignedCourses, createCourse} =require('../controllers/courseController') // Correct import
const { authMiddleware } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Route to create a course (only accessible by admins)
router.post('/courses', authMiddleware, roleMiddleware('admin'), createCourse);  // Correct callback

// Route to fetch courses (admins can view all, professors can view their assigned courses)
router.get('/courses', authMiddleware, roleMiddleware('professor'), getAssignedCourses); // Correct callback

module.exports = router;
