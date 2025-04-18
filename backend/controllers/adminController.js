const path = require('path');
const fs = require('fs-extra');

// Import database utilities
const fileDb = require('../utils/fileDatabase');
const shareDb = require('../utils/shareDatabase');

/**
 * Get system statistics
 */
exports.getStats = async (req, res) => {
  try {
    // Get file stats
    const fileCount = await fileDb.countFiles();
    const files = await fileDb.listFiles(1, fileCount);
    const totalFileSize = files.reduce((total, file) => total + file.size, 0);
    const totalDownloads = files.reduce((total, file) => total + (file.downloads || 0), 0);
    
    // Get share stats
    const shareCount = await shareDb.countShares();
    const shares = await shareDb.listShares(1, shareCount);
    const totalShareDownloads = shares.reduce((total, share) => total + (share.downloads || 0), 0);
    
    // Get active users count from socket
    const io = req.app.get('io');
    const activeUsers = io ? Object.keys(io.sockets.sockets).length : 0;
    
    // Get disk usage
    const uploadsDir = path.join(__dirname, '../uploads');
    let diskUsage = 0;
    
    if (await fs.pathExists(uploadsDir)) {
      const files = await fs.readdir(uploadsDir);
      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
          diskUsage += stats.size;
        }
      }
    }
    
    res.json({
      success: true,
      stats: {
        files: {
          count: fileCount,
          totalSize: totalFileSize,
          totalDownloads
        },
        shares: {
          count: shareCount,
          totalDownloads: totalShareDownloads
        },
        system: {
          activeUsers,
          diskUsage,
          uptime: process.uptime()
        }
      }
    });
  } catch (err) {
    console.error('Error getting admin stats:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to get system stats',
      error: err.message
    });
  }
};

/**
 * Get all files with detailed info
 */
exports.getAllFiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const files = await fileDb.listFiles(page, limit);
    const totalFiles = await fileDb.countFiles();
    
    res.json({
      success: true,
      pagination: {
        page,
        limit,
        totalFiles,
        totalPages: Math.ceil(totalFiles / limit)
      },
      files: files.map(file => ({
        id: file.id,
        name: file.originalName,
        size: file.size,
        type: file.mimetype,
        uploadDate: file.uploadDate,
        downloads: file.downloads || 0,
        path: file.path
      }))
    });
  } catch (err) {
    console.error('Error getting all files:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to get files',
      error: err.message
    });
  }
};

/**
 * Get all shares with detailed info
 */
exports.getAllShares = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const shares = await shareDb.listShares(page, limit);
    const totalShares = await shareDb.countShares();
    
    // Get file info for each share
    const sharesWithFiles = [];
    for (const share of shares) {
      const files = [];
      for (const fileId of share.fileIds) {
        const fileInfo = await fileDb.getFileById(fileId);
        if (fileInfo) {
          files.push({
            id: fileInfo.id,
            name: fileInfo.originalName,
            size: fileInfo.size
          });
        }
      }
      
      sharesWithFiles.push({
        id: share.id,
        createdAt: share.createdAt,
        expiresAt: share.expiresAt,
        downloads: share.downloads || 0,
        files,
        fileCount: files.length
      });
    }
    
    res.json({
      success: true,
      pagination: {
        page,
        limit,
        totalShares,
        totalPages: Math.ceil(totalShares / limit)
      },
      shares: sharesWithFiles
    });
  } catch (err) {
    console.error('Error getting all shares:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to get shares',
      error: err.message
    });
  }
};

/**
 * Delete a file (admin override)
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
    
    // Also remove file from any shares
    const shareCount = await shareDb.countShares();
    const shares = await shareDb.listShares(1, shareCount);
    
    for (const share of shares) {
      if (share.fileIds.includes(fileId)) {
        // Remove the file from this share
        const updatedFileIds = share.fileIds.filter(id => id !== fileId);
        
        // If no files left, delete the share
        if (updatedFileIds.length === 0) {
          await shareDb.deleteShare(share.id);
        } else {
          // Update the share with the remaining files
          await shareDb.updateShare(share.id, { fileIds: updatedFileIds });
        }
      }
    }
    
    // Emit socket event for real-time updates
    req.app.get('io').emit('adminFileDeleted', {
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
 * Delete a share (admin override)
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
    
    // Delete share
    await shareDb.deleteShare(shareId);
    
    // Emit socket event for real-time updates
    req.app.get('io').emit('adminShareDeleted', {
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

/**
 * Get active users information
 */
exports.getActiveUsers = async (req, res) => {
  try {
    const io = req.app.get('io');
    if (!io) {
      return res.json({
        success: true,
        activeUsers: 0,
        users: []
      });
    }
    
    const connectedSockets = Object.values(io.sockets.sockets);
    const users = connectedSockets.map(socket => ({
      id: socket.id,
      ip: socket.handshake.address,
      connectedAt: socket.handshake.time,
      userAgent: socket.handshake.headers['user-agent'] || 'Unknown'
    }));
    
    res.json({
      success: true,
      activeUsers: users.length,
      users
    });
  } catch (err) {
    console.error('Error getting active users:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to get active users',
      error: err.message
    });
  }
};

/**
 * Run system cleanup (expired shares, temp files)
 */
exports.runCleanup = async (req, res) => {
  try {
    const results = {
      expiredShares: 0,
      orphanedFiles: 0,
      tempFiles: 0
    };
    
    // 1. Clean up expired shares
    const shareCount = await shareDb.countShares();
    const shares = await shareDb.listShares(1, shareCount);
    
    for (const share of shares) {
      if (share.expiresAt && new Date() > new Date(share.expiresAt)) {
        await shareDb.deleteShare(share.id);
        results.expiredShares++;
      }
    }
    
    // 2. Clean up temp files
    const tempDir = path.join(__dirname, '../temp');
    if (await fs.pathExists(tempDir)) {
      const tempFiles = await fs.readdir(tempDir);
      
      for (const file of tempFiles) {
        const filePath = path.join(tempDir, file);
        await fs.unlink(filePath);
        results.tempFiles++;
      }
    }
    
    // 3. Find orphaned files (files on disk but not in database)
    const uploadsDir = path.join(__dirname, '../uploads');
    if (await fs.pathExists(uploadsDir)) {
      const diskFiles = await fs.readdir(uploadsDir);
      const fileCount = await fileDb.countFiles();
      const dbFiles = await fileDb.listFiles(1, fileCount);
      const dbFileNames = dbFiles.map(file => path.basename(file.path));
      
      for (const file of diskFiles) {
        if (!dbFileNames.includes(file)) {
          const filePath = path.join(uploadsDir, file);
          await fs.unlink(filePath);
          results.orphanedFiles++;
        }
      }
    }
    
    res.json({
      success: true,
      message: 'Cleanup completed successfully',
      results
    });
  } catch (err) {
    console.error('Error running cleanup:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to run cleanup',
      error: err.message
    });
  }
}; 