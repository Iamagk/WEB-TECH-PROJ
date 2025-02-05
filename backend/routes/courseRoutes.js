const express = require("express");
const router = express.Router();
const {
  getAssignedCourses,
  createCourse,
} = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { PDFDocument } = require('pdf-lib');
const axios = require('axios');
const Course = require('../models/courseModel');
const multer = require('multer');
const cloudinary = require('../services/cloudinaryService');
const Busboy = require('busboy');
const { Readable } = require('stream');

// Only allow admins to create courses
//router.post('/courses', authMiddleware, roleMiddleware('admin'), createCourse);
router.post("/course", authMiddleware, createCourse);

// Professors can view their assigned courses
//router.get('/courses', authMiddleware, roleMiddleware('professor'), getAssignedCourses);
router.get("/course", authMiddleware, getAssignedCourses);

// Route to generate merged PDF
router.post('/generate-file', authMiddleware, async (req, res) => {
    try {
        console.log('File generation started');
        const { courseCode } = req.body;
        
        const course = await Course.findOne({ code: courseCode });
        if (!course) {
            throw new Error('Course not found');
        }

        console.log('Found course files:', course.files);

        // Create new PDF
        const mergedPdf = await PDFDocument.create();
        let hasAddedPages = false;

        // Merge PDFs
        for (const file of course.files) {
            try {
                console.log(`Fetching file: ${file.type} from ${file.url}`);
                const response = await axios.get(file.url, { 
                    responseType: 'arraybuffer',
                    timeout: 10000 
                });

                const pdfDoc = await PDFDocument.load(response.data);
                const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                pages.forEach(page => mergedPdf.addPage(page));
                hasAddedPages = true;
                console.log(`Added ${pages.length} pages from ${file.type}`);
            } catch (error) {
                console.error(`Error processing ${file.type}:`, error);
            }
        }

        // Add default page if no files were merged
        if (!hasAddedPages) {
            const page = mergedPdf.addPage();
            page.drawText('No files available', {
                x: 50,
                y: page.getHeight() - 50,
                size: 20
            });
        }

        // Save and send PDF
        const pdfBytes = await mergedPdf.save();
        console.log('Generated PDF size:', pdfBytes.length);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${courseCode}_course_file.pdf`);
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({ 
            message: 'Error generating file',
            error: error.message 
        });
    }
});

// Route to save file URLs
router.post('/files', authMiddleware, async (req, res) => {
    try {
        const { courseCode, files } = req.body;

        const course = await Course.findOne({ code: courseCode });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Update or add new files
        for (const [fileType, url] of Object.entries(files)) {
            const fileIndex = course.files.findIndex(f => f.type === fileType);
            if (fileIndex !== -1) {
                course.files[fileIndex].url = url;
            } else {
                course.files.push({ type: fileType, url });
            }
        }

        await course.save();
        res.json({ message: 'Files updated successfully', course });

    } catch (error) {
        console.error('Error saving file URLs:', error);
        res.status(500).json({ 
            message: 'Error saving file URLs',
            error: error.message 
        });
    }
});

// Custom error classes
class FileValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FileValidationError';
        this.status = 400;
    }
}

class BusboyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BusboyError';
        this.status = 400;
    }
}

// Custom error class for better error handling
class UploadError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.name = 'UploadError';
        this.status = status;
    }
}

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
        files: 25,
        fieldSize: 10 * 1024 * 1024
    }
}).any();

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (file, courseCode) => {
    try {
        const result = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
            {
                resource_type: 'raw',
                public_id: `courses/${courseCode}/${file.originalname.replace('.pdf', '')}`,
                format: 'pdf',
                timeout: 120000
            }
        );
        return result.secure_url;
    } catch (error) {
        console.error(`Cloudinary upload error for ${file.fieldname}:`, error);
        throw error;
    }
};

// File upload route
router.post("/upload", authMiddleware, async (req, res) => {
    console.log('Starting upload process...');

    try {
        // Handle file upload
        await new Promise((resolve, reject) => {
            upload(req, res, function(err) {
                if (err) {
                    console.error('Multer error:', err);
                    reject(err);
                    return;
                }
                resolve();
            });
        });

        // Validate request
        if (!req.body?.courseCode) {
            throw new Error('Course code is required');
        }

        const { courseCode } = req.body;
        console.log(`Processing files for course: ${courseCode}`);

        // Find course
        const course = await Course.findOne({ code: courseCode });
        if (!course) {
            throw new Error('Course not found');
        }

        // Process files
        const fileUrls = {};
        const uploadErrors = [];
        const batchSize = 3;

        // Process files in batches
        for (let i = 0; i < (req.files?.length || 0); i += batchSize) {
            const batch = req.files.slice(i, i + batchSize);
            
            await Promise.all(batch.map(async (file) => {
                try {
                    console.log(`Processing ${file.fieldname}`);
                    const url = await uploadToCloudinary(file, courseCode);
                    fileUrls[file.fieldname] = url;
                    console.log(`Successfully uploaded ${file.fieldname}`);
                } catch (error) {
                    console.error(`Error uploading ${file.fieldname}:`, error);
                    uploadErrors.push({
                        field: file.fieldname,
                        error: error.message
                    });
                } finally {
                    // Clear buffer
                    if (file.buffer) {
                        file.buffer = null;
                    }
                }
            }));

            // Add delay between batches
            if (i + batchSize < req.files.length) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        // Update course document
        if (Object.keys(fileUrls).length > 0) {
            Object.entries(fileUrls).forEach(([type, url]) => {
                const fileIndex = course.files.findIndex(f => f.type === type);
                if (fileIndex !== -1) {
                    course.files[fileIndex].url = url;
                } else {
                    course.files.push({ type, url });
                }
            });

            await course.save();
            console.log('Course document updated successfully');
        }

        res.json({
            message: uploadErrors.length > 0 ? 'Some files uploaded with errors' : 'All files uploaded successfully',
            files: fileUrls,
            errors: uploadErrors.length > 0 ? uploadErrors : undefined
        });

    } catch (error) {
        console.error('Upload process error:', error);
        res.status(500).json({
            message: 'File upload failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Cleanup function
function cleanup(req) {
    if (req.files) {
        Object.values(req.files).forEach(fileArray => {
            fileArray.forEach(file => {
                if (file.buffer) {
                    file.buffer = null;
                }
            });
        });
    }
}

module.exports = router;

