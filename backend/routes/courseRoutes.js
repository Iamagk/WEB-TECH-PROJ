const express = require('express');
const router = express.Router();
const { getAssignedCourses, createCourse } = require('../controllers/courseController');
const authenticate = require('../middlewares/authMiddleware');

// Route to fetch courses assigned to the authenticated professor
router.get('/assigned-courses', authenticate, getAssignedCourses);

// Route to create a new course (accessible by authorized users)
router.post('/create-course', authenticate, createCourse);

module.exports = router;
