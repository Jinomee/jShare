const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Authentication middleware
const authenticateAdmin = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // In a real app, this would check against a securely stored API key
  // For demo purposes, we're using a hardcoded key
  if (apiKey === 'admin-api-key-12345') {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Unauthorized - Invalid API key'
    });
  }
};

// Apply auth middleware to all routes
router.use(authenticateAdmin);

// Admin routes
router.get('/stats', adminController.getStats);
router.get('/files', adminController.getAllFiles);
router.get('/shares', adminController.getAllShares);
router.delete('/files/:fileId', adminController.deleteFile);
router.delete('/shares/:shareId', adminController.deleteShare);
router.get('/active-users', adminController.getActiveUsers);
router.post('/cleanup', adminController.runCleanup);

module.exports = router; 