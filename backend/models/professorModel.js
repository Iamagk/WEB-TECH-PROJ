// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const professorSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     role: {
//       type: String,
//       default: "professor", // Default role is "professor"
//     },
//   },
//   {
//     timestamps: true,
//   }
// );
// // Hash the password before saving
// professorSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// // Instance method to compare passwords
// professorSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };
// module.exports = mongoose.model("Professor", professorSchema);





const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the schema
const professorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      default: "professor", // Default role is "professor"
    },
    uploadedFiles: [
      {
        title: {
          type: String,
          required: true, // Ensure every file has a title
        },
        url: {
          type: String,
          required: true, // Store the URL of the uploaded file
        },
        uploadedAt: {
          type: Date,
          default: Date.now, // Automatically set the upload date
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Hash the password before saving
professorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Instance method to compare passwords
professorSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the model
module.exports = mongoose.model("Professor", professorSchema);
