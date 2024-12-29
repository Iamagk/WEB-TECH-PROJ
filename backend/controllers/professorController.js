const Professor = require('../models/professorModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { z } = require('zod');

// Define Zod schemas
const signupSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email format.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format.'),
  password: z.string().min(1, 'Password is required.')
});

// Sign up a new professor
const signupProfessor = async (req, res) => {
  try {
    // Validate request body with Zod
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: 'Invalid input.', errors: validation.error.errors });
    }

    const { name, email, password } = validation.data;

    // Check if professor already exists
    const existingProfessor = await Professor.findOne({ email });
    if (existingProfessor) {
      return res.status(409).json({ message: 'Email is already in use.' });
    }

    // Create new professor
    const newProfessor = new Professor({
      name,
      email,
      password, // Password will be hashed by the model's pre-save middleware
    });

    await newProfessor.save();

    res.status(201).json({ message: 'Professor signed up successfully.', professor: newProfessor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error.', error: err.message });
  }
};

// Log in a professor
const loginProfessor = async (req, res) => {
  try {
    // Validate request body with Zod
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: 'Invalid input.', errors: validation.error.errors });
    }

    const { email, password } = validation.data;

    // Find professor by email
    const professor = await Professor.findOne({ email });
    if (!professor) {
      return res.status(404).json({ message: 'Invalid email or password.' });
    }

    // Compare passwords
    const isMatch = await professor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ email: professor.email, id: professor._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Logged in successfully.', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error.', error: err.message });
  }
};

// Get professor profile
const getProfessorProfile = async (req, res) => {
  try {
    const professorEmail = req.professor.email; // Extract professor email from the validated token

    const professor = await Professor.findOne({ email: professorEmail }).select('-password'); // Exclude password
    if (!professor) {
      return res.status(404).json({ message: 'Professor not found.' });
    }

    res.status(200).json({ professor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error.', error: err.message });
  }
};

module.exports = {
  signupProfessor,
  loginProfessor,
  getProfessorProfile,
};
