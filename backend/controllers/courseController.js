const prisma = require('../prisma'); // Prisma client

// Controller to get courses assigned to the logged-in professor
const getAssignedCourses = async (req, res) => {
  try {
    // Get the logged-in professor's email from the user attached to the request
    const professorEmail = req.user.email;

    // Fetch the professor's details (including id) using email
    const professor = await prisma.professor.findUnique({
      where: { email: professorEmail },
    });

    // If the professor does not exist, return a 404 error
    if (!professor) {
      return res.status(404).json({ message: 'Professor not found' });
    }

    // Now fetch the courses assigned to this professor using their id
    const courses = await prisma.course.findMany({
      where: {
        professorId: professor.id, // Use the professor's id to filter courses
      },
      select: {
        id: true,
        name: true,
        code: true,
        courseDesign: true,
        questionBank: true,
        timeTable: true,
        calendar: true,
        studentList: true,
        questionPaper: true,
        pacMom: true,
        iaMarks: true,
        pbl: true,
      },
    });

    // If no courses are found, return an appropriate message
    if (courses.length === 0) {
      return res.status(404).json({ message: 'No courses assigned to you' });
    }

    // Return the list of assigned courses
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAssignedCourses,
};
