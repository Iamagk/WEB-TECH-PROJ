const express = require("express");
const router = express.Router();
const {
  signupProfessor,
  loginProfessor,
  getProfessorProfile,
  uploadFile,
  getUploadedFiles,
  updateProfessorProfile,
} = require("../controllers/professorController");
const authMiddleware = require("../middlewares/authMiddleware");

// Add logging to see when routes are registered
console.log('Registering professor routes...');

// Route to sign up a new professor
router.post("/signup", signupProfessor);

// Route to log in an existing professor
router.post("/login", loginProfessor);

// Route to fetch the authenticated professor's profile
router.get("/profile", authMiddleware, (req, res, next) => {
    console.log('GET /profile route hit');
    getProfessorProfile(req, res, next);
});

// Route to update professor's profile
router.put("/profile", authMiddleware, (req, res, next) => {
    console.log('PUT /profile route hit');
    updateProfessorProfile(req, res, next);
});

// Route to upload a file (authenticated)
router.post("/upload", authMiddleware, uploadFile);

// Route to get uploaded files (authenticated)
router.get("/files", authMiddleware, getUploadedFiles);

module.exports = router;
