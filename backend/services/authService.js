const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Professor = require("../models/professorModel");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Authenticate Professor
const authenticateProfessor = async (email, password) => {
  const professor = await Professor.findOne({ email });
  if (!professor) {
    throw new Error("Invalid credentials.");
  }

  const isMatch = await bcrypt.compare(password, professor.password);
  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }

  return { professor, token: generateToken(professor._id) };
};

module.exports = { authenticateProfessor, generateToken };
