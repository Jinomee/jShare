const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const { nanoid } = require('nanoid');

// File controller functions
const fileController = require('../controllers/fileController');

// Upload a file
router.post('/upload', fileController.uploadFile);

// Get file info
router.get('/:fileId', fileController.getFileInfo);

// Download a file
router.get('/download/:fileId', fileController.downloadFile);

// Delete a file
router.delete('/:fileId', fileController.deleteFile);

// List all files (with optional pagination)
router.get('/', fileController.listFiles);

module.exports = router;
