/**
 * File database utility
 * In a production environment, this would use a real database
 * For simplicity, we're using an in-memory store with file persistence
 */
const fs = require('fs-extra');
const path = require('path');

// In-memory store
let files = [];

// Path to persistence file
const dbFilePath = path.join(__dirname, '../data/files.json');

// Ensure data directory exists
fs.ensureDirSync(path.join(__dirname, '../data'));

// Initialize database
const initDatabase = async () => {
  try {
    if (await fs.pathExists(dbFilePath)) {
      const data = await fs.readJson(dbFilePath);
      files = data;
      console.log(`Loaded ${files.length} files from database`);
    } else {
      // Create empty database file
      await fs.writeJson(dbFilePath, []);
      console.log('Created new files database');
    }
  } catch (err) {
    console.error('Error initializing file database:', err);
    // Create empty database file if error occurs
    await fs.writeJson(dbFilePath, []);
  }
};

// Save database to disk
const saveDatabase = async () => {
  try {
    await fs.writeJson(dbFilePath, files, { spaces: 2 });
  } catch (err) {
    console.error('Error saving file database:', err);
  }
};

// Initialize database on module load
initDatabase();

// Save a file
exports.saveFile = async (fileInfo) => {
  files.push(fileInfo);
  await saveDatabase();
  return fileInfo;
};

// Get a file by ID
exports.getFileById = async (fileId) => {
  return files.find(file => file.id === fileId);
};

// Update a file
exports.updateFile = async (fileId, updates) => {
  const index = files.findIndex(file => file.id === fileId);
  if (index === -1) return null;
  
  files[index] = { ...files[index], ...updates };
  await saveDatabase();
  return files[index];
};

// Delete a file
exports.deleteFile = async (fileId) => {
  const index = files.findIndex(file => file.id === fileId);
  if (index === -1) return false;
  
  files.splice(index, 1);
  await saveDatabase();
  return true;
};

// List files with pagination
exports.listFiles = async (page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  return files
    .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
    .slice(startIndex, endIndex);
};

// Count total files
exports.countFiles = async () => {
  return files.length;
};

// Increment download count
exports.incrementDownloads = async (fileId) => {
  const file = files.find(file => file.id === fileId);
  if (!file) return false;
  
  file.downloads = (file.downloads || 0) + 1;
  await saveDatabase();
  return true;
};
