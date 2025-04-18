/**
 * Share database utility
 * In a production environment, this would use a real database
 * For simplicity, we're using an in-memory store with file persistence
 */
const fs = require('fs-extra');
const path = require('path');

// In-memory store
let shares = [];

// Path to persistence file
const dbFilePath = path.join(__dirname, '../data/shares.json');

// Ensure data directory exists
fs.ensureDirSync(path.join(__dirname, '../data'));

// Initialize database
const initDatabase = async () => {
  try {
    if (await fs.pathExists(dbFilePath)) {
      const data = await fs.readJson(dbFilePath);
      shares = data;
      console.log(`Loaded ${shares.length} shares from database`);
    } else {
      // Create empty database file
      await fs.writeJson(dbFilePath, []);
      console.log('Created new shares database');
    }
  } catch (err) {
    console.error('Error initializing share database:', err);
    // Create empty database file if error occurs
    await fs.writeJson(dbFilePath, []);
  }
};

// Save database to disk
const saveDatabase = async () => {
  try {
    await fs.writeJson(dbFilePath, shares, { spaces: 2 });
  } catch (err) {
    console.error('Error saving share database:', err);
  }
};

// Initialize database on module load
initDatabase();

// Save a share
exports.saveShare = async (shareInfo) => {
  shares.push(shareInfo);
  await saveDatabase();
  return shareInfo;
};

// Get a share by ID
exports.getShareById = async (shareId) => {
  return shares.find(share => share.id === shareId);
};

// Update a share
exports.updateShare = async (shareId, updates) => {
  const index = shares.findIndex(share => share.id === shareId);
  if (index === -1) return null;
  
  shares[index] = { ...shares[index], ...updates };
  await saveDatabase();
  return shares[index];
};

// Delete a share
exports.deleteShare = async (shareId) => {
  const index = shares.findIndex(share => share.id === shareId);
  if (index === -1) return false;
  
  shares.splice(index, 1);
  await saveDatabase();
  return true;
};

// List shares with pagination
exports.listShares = async (page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  return shares
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(startIndex, endIndex);
};

// Count total shares
exports.countShares = async () => {
  return shares.length;
};

// Increment download count
exports.incrementDownloads = async (shareId) => {
  const share = shares.find(share => share.id === shareId);
  if (!share) return false;
  
  share.downloads = (share.downloads || 0) + 1;
  await saveDatabase();
  return true;
};

// Clean up expired shares
exports.cleanupExpiredShares = async () => {
  const now = new Date();
  const initialCount = shares.length;
  
  shares = shares.filter(share => {
    return !share.expiresAt || new Date(share.expiresAt) > now;
  });
  
  if (initialCount !== shares.length) {
    await saveDatabase();
    return initialCount - shares.length;
  }
  
  return 0;
};
