const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
    upload_preset: 'course_files' // Create this preset in Cloudinary dashboard
});

// Configure global upload settings
cloudinary.config({
    timeout: 120000, // 2 minutes
    chunk_size: 6000000 // 6MB chunks
});

module.exports = cloudinary;