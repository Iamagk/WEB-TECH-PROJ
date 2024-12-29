const { z } = require('zod');
const Course = require('../models/courseModel');
const Professor = require('../models/professorModel');

// Define your Zod schema for course creation
const createCourseSchema = z.object({
  code: z.string().min(1, 'Course code is required.'),
  name: z.string().min(1, 'Course name is required.'),
  batch: z.string().regex(/^\d{4}-\d{4}$/, 'Batch should be in the format YYYY-YYYY.'),
  category: z.enum(['Core', 'Elective'], 'Invalid category. Use "Core" or "Elective".'),
  section: z.string().min(1, 'Section is required.'),
  professorEmail: z.string().email('Invalid professor email format.'),
});

// Controller to get assigned courses
const getAssignedCourses = async (req, res) => {
  try {
    const professorEmail = req.professor.email;
    const professor = await Professor.findOne({ email: professorEmail });

    if (!professor) {
      return res.status(404).json({ message: 'Professor not found.' });
    }

    const courses = await Course.find({ professor: professor._id });
    if (courses.length === 0) {
      return res.status(404).json({ message: 'No courses assigned to this professor.' });
    }

    res.status(200).json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error.' });
  }
};

// Controller to create a new course
const createCourse = async (req, res) => {
  try {
    const validation = createCourseSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: 'Invalid input.', errors: validation.error.errors });
    }

    const { code, name, batch, category, section, professorEmail } = validation.data;
    const professor = await Professor.findOne({ email: professorEmail });

    if (!professor) {
      return res.status(404).json({ message: 'Professor not found.' });
    }

    const newCourse = new Course({
      code,
      name,
      batch,
      category,
      section,
      professor: professor._id,
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully.', course: newCourse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error.', error: err.message });
  }
};

// Export the functions for use in routes
module.exports = {
  getAssignedCourses,
  createCourse,
};