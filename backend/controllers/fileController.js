const path = require('path');
const fs = require('fs-extra');
const { nanoid } = require('nanoid');

// Database utility (in a real app, this would be a database connection)
const fileDb = require('../utils/fileDatabase');

/**
 * Upload a file to the server
 */
exports.uploadFile = async (req, res) => {
  try {
    console.log('Upload request received', req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No files in request');
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded'
      });
    }

    const file = req.files.file;
    console.log('File to upload:', file.name, 'size:', file.size);
    const fileId = nanoid(10);
    const fileExtension = path.extname(file.name);
    const fileName = `${fileId}${fileExtension}`;
    const uploadPath = path.join(__dirname, '../uploads', fileName);
    console.log('Upload path:', uploadPath);

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '../uploads');
    await fs.ensureDir(uploadsDir);

    // Move the file to the uploads directory
    await file.mv(uploadPath);
    console.log('File moved successfully to', uploadPath);

    // Verify file exists
    const fileExists = await fs.pathExists(uploadPath);
    console.log('File exists in destination:', fileExists);

    // Save file metadata
    const fileInfo = {
      id: fileId,
      originalName: file.name,
      fileName: fileName,
      size: file.size,
      mimetype: file.mimetype,
      path: uploadPath,
      uploadDate: new Date(),
      downloads: 0
    };

    await fileDb.saveFile(fileInfo);
    console.log('File metadata saved successfully');

    // Emit socket event for real-time updates
    if (req.app.get('io')) {
      req.app.get('io').emit('fileUploaded', {
        id: fileId,
        name: file.name,
        size: file.size
      });
      console.log('Socket event emitted for file upload');
    } else {
      console.log('Socket.io instance not available');
    }

    res.status(201).json({
      success: true,
      fileId: fileId,
      fileName: file.name,
      size: file.size,
      downloadUrl: `/api/files/download/${fileId}`
    });
    console.log('Upload response sent successfully');
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: err.message
    });
  }
};

/**
 * Get file information
 */
exports.getFileInfo = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const fileInfo = await fileDb.getFileById(fileId);

    if (!fileInfo) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      file: {
        id: fileInfo.id,
        name: fileInfo.originalName,
        size: fileInfo.size,
        type: fileInfo.mimetype,
        uploadDate: fileInfo.uploadDate,
        downloads: fileInfo.downloads
      }
    });
  } catch (err) {
    console.error('Error getting file info:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to get file info',
      error: err.message
    });
  }
};

/**
 * Download a file
 */
exports.downloadFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const fileInfo = await fileDb.getFileById(fileId);

    if (!fileInfo) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if file exists on disk
    if (!fs.existsSync(fileInfo.path)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    // Update download count
    await fileDb.incrementDownloads(fileId);

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${fileInfo.originalName}"`);
    res.setHeader('Content-Type', fileInfo.mimetype);

    // Stream the file
    const fileStream = fs.createReadStream(fileInfo.path);
    fileStream.pipe(res);

    // Emit socket event for real-time updates
    req.app.get('io').emit('fileDownloaded', {
      id: fileId,
      name: fileInfo.originalName
    });
  } catch (err) {
    console.error('Error downloading file:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to download file',
      error: err.message
    });
  }
};

/**
 * Delete a file
 */
exports.deleteFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const fileInfo = await fileDb.getFileById(fileId);

    if (!fileInfo) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete file from disk
    if (fs.existsSync(fileInfo.path)) {
      await fs.unlink(fileInfo.path);
    }

    // Delete file metadata
    await fileDb.deleteFile(fileId);

    // Emit socket event for real-time updates
    req.app.get('io').emit('fileDeleted', {
      id: fileId,
      name: fileInfo.originalName
    });

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: err.message
    });
  }
};

/**
 * List all files
 */
exports.listFiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const files = await fileDb.listFiles(page, limit);
    const totalFiles = await fileDb.countFiles();
    
    res.json({
      success: true,
      files: files.map(file => ({
        id: file.id,
        name: file.originalName,
        size: file.size,
        type: file.mimetype,
        uploadDate: file.uploadDate,
        downloads: file.downloads
      })),
      pagination: {
        page,
        limit,
        totalFiles,
        totalPages: Math.ceil(totalFiles / limit)
      }
    });
  } catch (err) {
    console.error('Error listing files:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to list files',
      error: err.message
    });
  }
};
