const path = require('path');
const fs = require('fs-extra');
const { nanoid } = require('nanoid');
const archiver = require('archiver');

// Database utilities
const shareDb = require('../utils/shareDatabase');
const fileDb = require('../utils/fileDatabase');

/**
 * Create a new share link for one or more files
 */
exports.createShareLink = async (req, res) => {
  try {
    const { fileIds, expiryTime } = req.body;
    
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files specified for sharing'
      });
    }

    // Verify all files exist
    const files = [];
    for (const fileId of fileIds) {
      const fileInfo = await fileDb.getFileById(fileId);
      if (!fileInfo) {
        return res.status(404).json({
          success: false,
          message: `File with ID ${fileId} not found`
        });
      }
      files.push(fileInfo);
    }

    // Create share record
    const shareId = nanoid(10);
    const shareInfo = {
      id: shareId,
      fileIds,
      createdAt: new Date(),
      expiresAt: expiryTime ? new Date(Date.now() + expiryTime * 1000) : null,
      downloads: 0
    };

    await shareDb.saveShare(shareInfo);

    // Generate share URL
    const shareUrl = `${req.protocol}://${req.get('host')}/share/${shareId}`;

    // Emit socket event for real-time updates
    req.app.get('io').emit('shareCreated', {
      id: shareId,
      files: files.map(file => ({
        id: file.id,
        name: file.originalName
      }))
    });

    res.status(201).json({
      success: true,
      shareId,
      shareUrl,
      files: files.map(file => ({
        id: file.id,
        name: file.originalName,
        size: file.size
      })),
      expiresAt: shareInfo.expiresAt
    });
  } catch (err) {
    console.error('Error creating share:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create share',
      error: err.message
    });
  }
};

/**
 * Get share information
 */
exports.getShareInfo = async (req, res) => {
  try {
    const shareId = req.params.shareId;
    const shareInfo = await shareDb.getShareById(shareId);

    if (!shareInfo) {
      return res.status(404).json({
        success: false,
        message: 'Share not found'
      });
    }

    // Check if share has expired
    if (shareInfo.expiresAt && new Date() > new Date(shareInfo.expiresAt)) {
      return res.status(410).json({
        success: false,
        message: 'This share has expired'
      });
    }

    // Get file information for all files in the share
    const files = [];
    for (const fileId of shareInfo.fileIds) {
      const fileInfo = await fileDb.getFileById(fileId);
      if (fileInfo) {
        files.push({
          id: fileInfo.id,
          name: fileInfo.originalName,
          size: fileInfo.size,
          type: fileInfo.mimetype
        });
      }
    }

    res.json({
      success: true,
      share: {
        id: shareInfo.id,
        createdAt: shareInfo.createdAt,
        expiresAt: shareInfo.expiresAt,
        downloads: shareInfo.downloads,
        files
      }
    });
  } catch (err) {
    console.error('Error getting share info:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to get share info',
      error: err.message
    });
  }
};

/**
 * List files in a share
 */
exports.listSharedFiles = async (req, res) => {
  try {
    const shareId = req.params.shareId;
    const shareInfo = await shareDb.getShareById(shareId);

    if (!shareInfo) {
      return res.status(404).json({
        success: false,
        message: 'Share not found'
      });
    }

    // Check if share has expired
    if (shareInfo.expiresAt && new Date() > new Date(shareInfo.expiresAt)) {
      return res.status(410).json({
        success: false,
        message: 'This share has expired'
      });
    }

    // Get file information for all files in the share
    const files = [];
    for (const fileId of shareInfo.fileIds) {
      const fileInfo = await fileDb.getFileById(fileId);
      if (fileInfo) {
        files.push({
          id: fileInfo.id,
          name: fileInfo.originalName,
          size: fileInfo.size,
          type: fileInfo.mimetype,
          downloadUrl: `/api/files/download/${fileInfo.id}`
        });
      }
    }

    res.json({
      success: true,
      files
    });
  } catch (err) {
    console.error('Error listing shared files:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to list shared files',
      error: err.message
    });
  }
};

/**
 * Download all files in a share as a zip
 */
exports.downloadAllFiles = async (req, res) => {
  try {
    const shareId = req.params.shareId;
    const shareInfo = await shareDb.getShareById(shareId);

    if (!shareInfo) {
      return res.status(404).json({
        success: false,
        message: 'Share not found'
      });
    }

    // Check if share has expired
    if (shareInfo.expiresAt && new Date() > new Date(shareInfo.expiresAt)) {
      return res.status(410).json({
        success: false,
        message: 'This share has expired'
      });
    }

    // Increment download count
    await shareDb.incrementDownloads(shareId);

    // Set up zip file
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="jshare-${shareId}.zip"`);

    const archive = archiver('zip', {
      zlib: { level: 9 } // Compression level
    });

    // Pipe archive data to the response
    archive.pipe(res);

    // Add each file to the archive
    for (const fileId of shareInfo.fileIds) {
      const fileInfo = await fileDb.getFileById(fileId);
      if (fileInfo && fs.existsSync(fileInfo.path)) {
        archive.file(fileInfo.path, { name: fileInfo.originalName });
      }
    }

    // Finalize the archive and send the response
    await archive.finalize();

    // Emit socket event for real-time updates
    req.app.get('io').emit('shareDownloaded', {
      id: shareId
    });
  } catch (err) {
    console.error('Error downloading shared files:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to download shared files',
      error: err.message
    });
  }
};

/**
 * Delete a share
 */
exports.deleteShare = async (req, res) => {
  try {
    const shareId = req.params.shareId;
    const shareInfo = await shareDb.getShareById(shareId);

    if (!shareInfo) {
      return res.status(404).json({
        success: false,
        message: 'Share not found'
      });
    }

    // Delete share metadata
    await shareDb.deleteShare(shareId);

    // Emit socket event for real-time updates
    req.app.get('io').emit('shareDeleted', {
      id: shareId
    });

    res.json({
      success: true,
      message: 'Share deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting share:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete share',
      error: err.message
    });
  }
};
