const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dooaoygrc',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate a Course File as a PDF
const generateCourseFile = async (courseData) => {
  try {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../temp/${courseData.code}-course-file.pdf`);

    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(16).text(`Course File for ${courseData.name}`, { align: 'center' });
    doc.text(`\nCourse Code: ${courseData.code}`);
    doc.text(`Batch: ${courseData.batch}`);
    doc.text(`Category: ${courseData.category}`);
    doc.text(`Section: ${courseData.section}`);
    doc.text(`Professor: ${courseData.professorName}`);

    // Add additional sections if required
    doc.end();

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'course-files',
    });

    // Delete the local file after upload
    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (err) {
    console.error('Error generating course file:', err);
    throw new Error('Course file generation failed.');
  }
};

module.exports = { generateCourseFile };
