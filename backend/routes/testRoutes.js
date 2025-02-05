const express = require("express");
const router = express.Router();
// const cloudinary = require('../services/cloudinary');
const cloudinary = require('../services/cloudinaryService');
// Test Cloudinary connection
router.get("/cloudinary-test", async (req, res) => {
    try {
        // Test API credentials
        const result = await cloudinary.api.ping();
        console.log('Cloudinary connection test:', result);
        res.json({ 
            status: 'success',
            message: 'Cloudinary connection successful',
            apiVersion: result.api_version
        });
    } catch (error) {
        console.error('Cloudinary test error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Cloudinary connection failed',
            error: error.message
        });
    }
});

// Test upload
router.post("/cloudinary-upload-test", async (req, res) => {
    try {
        // Create a small test buffer
        const testBuffer = Buffer.from('Test PDF content', 'utf-8');
        
        // Test upload
        const result = await cloudinary.uploader.upload(
            `data:application/pdf;base64,${testBuffer.toString('base64')}`,
            {
                resource_type: 'raw',
                public_id: 'test/test-file',
                format: 'pdf'
            }
        );

        console.log('Test upload result:', result);
        res.json({
            status: 'success',
            message: 'Test upload successful',
            url: result.secure_url
        });

    } catch (error) {
        console.error('Upload test error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Test upload failed',
            error: error.message
        });
    }
});

module.exports = router; 