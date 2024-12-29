const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get courses assigned to the logged-in professor
router.get('/assigned-courses', authMiddleware, courseController.getAssignedCourses);

module.exports = router;
