const mongoose = require('mongoose');
// add semester also
const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true, // Ensures course codes are unique
  },
  name: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true, // e.g., "2023-2027"
  },
  category: {
    type: String,
    required: true, // e.g., "Core", "Elective"
  },
  section: {
    type: String,
    required: true, // e.g., "A", "B"
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: true, // Ensures the course is assigned to a professor
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Automatically update `updatedAt` before saving
courseSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Course', courseSchema);
