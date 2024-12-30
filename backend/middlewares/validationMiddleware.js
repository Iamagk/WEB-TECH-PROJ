const { z } = require("zod");

// Zod schema for course creation
const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  code: z.string().min(3, "Course code must have at least 3 characters"),
  batch: z.string().min(1, "Batch is required"),
  category: z.string().min(1, "Category is required"),
  section: z.string().min(1, "Section is required"),
});

// Validation middleware for course data
const validateCourse = (req, res, next) => {
  try {
    courseSchema.parse(req.body); // Validate the request body against the schema
    next(); // If valid, proceed to the next middleware/controller
  } catch (error) {
    res.status(400).json({ error: error.errors[0].message }); // Send validation error message
  }
};

module.exports = { validateCourse };
