const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs-extra');
const http = require('http');
const socketIo = require('socket.io');
const { nanoid } = require('nanoid');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import route handlers
const fileRoutes = require('./routes/fileRoutes');
const shareRoutes = require('./routes/shareRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:8080', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposedHeaders: ['Content-Length', 'Content-Type']
  }
});

// Set up middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type']
}));
app.use(express.json());
app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 1024 * 1024 * 1024 // 1GB max file size
  },
  abortOnLimit: true,
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'temp')
}));
app.use(morgan('dev'));

// Ensure upload and temp directories exist
const uploadDir = path.join(__dirname, 'uploads');
const tempDir = path.join(__dirname, 'temp');
fs.ensureDirSync(uploadDir);
fs.ensureDirSync(tempDir);

// Log directory information
console.log('Upload directory:', uploadDir);
console.log('Temp directory:', tempDir);
console.log('Current working directory:', process.cwd());

// Make directories writable
try {
  fs.chmodSync(uploadDir, 0o777);
  fs.chmodSync(tempDir, 0o777);
  console.log('Set directory permissions to 777');
  
  // Create a test file to check write permissions
  const testFilePath = path.join(uploadDir, 'test-write.txt');
  fs.writeFileSync(testFilePath, 'This is a test file to check write permissions');
  console.log('Successfully created test file at:', testFilePath);
} catch (err) {
  console.error('Error setting directory permissions:', err);
}

// Make io available to the routes
app.set('io', io);

// Set up socket.io for real-time updates
require('./socket/socketHandler')(io);

// API routes
app.use('/api/files', fileRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/admin', adminRoutes);

// Define routes before serving static files
if (process.env.NODE_ENV === 'production') {
  // Production mode - serve the Vue app
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
} else {
  // Development mode - serve only the admin panel from backend
  
  // Admin panel route
  app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
  });
  
  // Redirect root URL to admin panel
  app.get('/', (req, res) => {
    res.redirect('/admin');
  });
  
  // Serve static files needed for admin panel
  app.use(express.static(path.join(__dirname, 'public'), {
    index: false // Prevent serving index.html for directory requests
  }));
  
  // Direct download route for files
  app.get('/download/:fileId/:fileName', (req, res) => {
    const fileId = req.params.fileId;
    const fileName = req.params.fileName;
    
    // In a real app, we would look up the file in the database
    // For this demo, we'll create a simple text file with the file ID
    const demoContent = `This is a demo download for file: ${fileId}\nFilename: ${fileName}`;
    
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'text/plain');
    
    // Send the file content
    res.send(demoContent);
  });
  
  // Redirect all other routes to admin
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) {
      // Let the API routes handle these requests
      next();
    } else {
      res.redirect('/admin');
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`jShare server running on port ${PORT}`);
});

module.exports = { app, server, io };
