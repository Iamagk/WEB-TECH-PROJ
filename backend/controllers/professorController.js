const Professor = require("../models/professorModel");
const { generateToken } = require("../services/tokenService");
const { z } = require("zod");

// Define Zod schemas for validation
const signupSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email format."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(1, "Password is required."),
});

const fileUploadSchema = z.object({
  title: z.string().min(1, "Title is required."),
  url: z.string().url("Invalid URL."),
});

// Sign up a new professor
const signupProfessor = async (req, res) => {
  try {
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ message: "Invalid input.", errors: validation.error.errors });
    }
    const { name, email, password } = validation.data;

    const existingProfessor = await Professor.findOne({ email });
    if (existingProfessor) {
      return res.status(409).json({ message: "Email is already in use." });
    }

    const newProfessor = new Professor({
      name,
      email,
      password,
    });

    await newProfessor.save();

    res.status(201).json({
      message: "Professor signed up successfully.",
      professor: newProfessor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error.", error: err.message });
  }
};

// Log in a professor
const loginProfessor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const professor = await Professor.findOne({ email });
    if (!professor) {
      return res.status(404).json({ message: "Professor not found." });
    }

    const isMatch = await professor.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = generateToken(professor);

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get professor profile
const getProfessorProfile = async (req, res) => {
  try {
    const professorEmail = req.user.email;

    const professor = await Professor.findOne({ email: professorEmail }).select(
      "-password"
    );
    if (!professor) {
      return res.status(404).json({ message: "Professor not found." });
    }

    res.status(200).json({ professor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error.", error: err.message });
  }
};

// Upload a file for a professor
const uploadFile = async (req, res) => {
  try {
    const validation = fileUploadSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ message: "Invalid input.", errors: validation.error.errors });
    }
    const { title, url } = validation.data;

    const professorEmail = req.user.email;
    const professor = await Professor.findOne({ email: professorEmail });
    if (!professor) {
      return res.status(404).json({ message: "Professor not found." });
    }

    professor.uploadedFiles.push({ title, url });
    await professor.save();

    res
      .status(200)
      .json({ message: "File uploaded successfully.", files: professor.uploadedFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error.", error: err.message });
  }
};

// Get uploaded files
const getUploadedFiles = async (req, res) => {
  try {
    const professorEmail = req.user.email;
    const professor = await Professor.findOne({ email: professorEmail }).select(
      "uploadedFiles"
    );
    if (!professor) {
      return res.status(404).json({ message: "Professor not found." });
    }

    res.status(200).json({ files: professor.uploadedFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error.", error: err.message });
  }
};

// Add this new controller function
const updateProfessorProfile = async (req, res) => {
    try {
        const professorEmail = req.user.email;
        const { name, email, password } = req.body;

        const professor = await Professor.findOne({ email: professorEmail });
        if (!professor) {
            return res.status(404).json({ message: "Professor not found." });
        }

        // Update fields
        if (name) professor.name = name;
        if (email) professor.email = email;
        if (password) {
            // This will trigger the pre-save hook to hash the password
            professor.password = password;
        }

        await professor.save();

        // Don't send password back in response
        res.status(200).json({
            message: "Profile updated successfully",
            professor: {
                name: professor.name,
                email: professor.email,
                role: professor.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error.", error: err.message });
    }
};

module.exports = {
  signupProfessor,
  loginProfessor,
  getProfessorProfile,
  updateProfessorProfile,
  uploadFile,
  getUploadedFiles,
};
