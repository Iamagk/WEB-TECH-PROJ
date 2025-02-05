const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan'); // For logging HTTP requests
const fileUpload = require('express-fileupload'); // For file uploads

// Importing routes
const courseRoutes = require('./routes/courseRoutes');
const professorRoutes = require('./routes/professorRoutes');

// Environment variables
dotenv.config();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI; // MongoDB connection string

// Initialize Express
const app = express();

// Configure body parser with higher limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ 
    extended: true,
    limit: '50mb',
    parameterLimit: 50000
}));

// Configure CORS with proper options
app.use(cors({
    origin:  'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware
app.use(morgan('dev')); // Enable logging for development
app.use(fileUpload({ createParentPath: true })); // Enable file uploads

// Add this before your routes
app.use((req, res, next) => {
    console.log('----------------------------------------');
    console.log('Incoming Request:');
    console.log('URL:', req.originalUrl);  // Use originalUrl to see the full path
    console.log('Method:', req.method);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('----------------------------------------');
    next();
});

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the application if the connection fails
  });

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running smoothly' });
});

// Main route prefixes
console.log('Mounting routes...');

// Mount course routes
app.use('/v0/courses', courseRoutes);

// Mount professor routes
app.use('/v0/professors', (req, res, next) => {
    console.log('Professor route accessed:', req.method, req.url);
    next();
}, professorRoutes);

// Add test routes
app.use('/v0/test', require('./routes/testRoutes'));

// Move the 404 handler to be after all routes
app.use('*', (req, res) => {
    console.log('404 for URL:', req.originalUrl);
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});