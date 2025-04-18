const express = require('express');
const router = express.Router();

// Share controller functions
const shareController = require('../controllers/shareController');

// Create a new share link
router.post('/create', shareController.createShareLink);

// Get share info
router.get('/:shareId', shareController.getShareInfo);

// List files in a share
router.get('/:shareId/files', shareController.listSharedFiles);

// Download all files in a share as zip
router.get('/:shareId/download', shareController.downloadAllFiles);

// Delete a share
router.delete('/:shareId', shareController.deleteShare);

module.exports = router;
