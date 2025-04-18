// Admin Panel JavaScript

// API Key for authentication
const API_KEY = 'admin-api-key-12345';

// API endpoints
const API = {
  stats: '/api/admin/stats',
  files: '/api/admin/files',
  shares: '/api/admin/shares',
  deleteFile: (id) => `/api/admin/files/${id}`,
  deleteShare: (id) => `/api/admin/shares/${id}`,
  cleanup: '/api/admin/cleanup',
  uploadFile: '/api/files/upload',
  createShare: '/api/share/create'
};

// Dark mode functionality
function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const moonIcon = document.getElementById('moon-icon');
  const sunIcon = document.getElementById('sun-icon');
  
  // Check for saved user preference
  const savedTheme = localStorage.getItem('theme');
  
  // Set initial theme based on preference or system preference
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark');
    moonIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark');
    moonIcon.classList.remove('hidden');
    sunIcon.classList.add('hidden');
    localStorage.setItem('theme', 'light');
  }
  
  // Toggle theme
  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark')) {
      // Switch to light mode
      document.body.classList.remove('dark');
      moonIcon.classList.remove('hidden');
      sunIcon.classList.add('hidden');
      localStorage.setItem('theme', 'light');
    } else {
      // Switch to dark mode
      document.body.classList.add('dark');
      moonIcon.classList.add('hidden');
      sunIcon.classList.remove('hidden');
      localStorage.setItem('theme', 'dark');
    }
  });
}

// File upload functionality
function setupFileUpload() {
  const fileInput = document.getElementById('file-input');
  const selectFilesBtn = document.getElementById('select-files-btn');
  const uploadForm = document.getElementById('upload-form');
  const dropZone = document.getElementById('drop-zone');
  const selectedFilesDiv = document.getElementById('selected-files');
  const fileList = document.getElementById('file-list');
  const uploadBtn = document.getElementById('upload-btn');
  const uploadProgress = document.getElementById('upload-progress');
  const progressBar = document.getElementById('progress-bar');
  const uploadStatus = document.getElementById('upload-status');
  const uploadResult = document.getElementById('upload-result');
  const resultList = document.getElementById('result-list');
  
  // Open file browser when button is clicked
  selectFilesBtn.addEventListener('click', () => {
    fileInput.click();
  });
  
  // Handle file selection
  fileInput.addEventListener('change', handleFileSelection);
  
  // Handle drag and drop
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
  });
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
  });
  
  function highlight() {
    dropZone.classList.add('border-indigo-400', 'bg-indigo-50');
  }
  
  function unhighlight() {
    dropZone.classList.remove('border-indigo-400', 'bg-indigo-50');
  }
  
  dropZone.addEventListener('drop', handleDrop, false);
  
  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFileSelection({ target: { files } });
  }
  
  function handleFileSelection(e) {
    const files = e.target.files;
    
    if (files.length > 0) {
      // Show selected files list
      selectedFilesDiv.classList.remove('hidden');
      uploadBtn.disabled = false;
      
      // Clear previous list
      fileList.innerHTML = '';
      
      // Add files to list
      Array.from(files).forEach(file => {
        const fileItem = document.createElement('li');
        fileItem.className = 'px-4 py-3 flex items-center justify-between';
        fileItem.innerHTML = `
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium text-gray-700">${file.name}</span>
          </div>
          <span class="text-xs text-gray-500">${formatBytes(file.size)}</span>
        `;
        fileList.appendChild(fileItem);
      });
    } else {
      // Hide list if no files
      selectedFilesDiv.classList.add('hidden');
      uploadBtn.disabled = true;
    }
  }
  
  // Handle form submission for file uploads
  uploadForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const files = fileInput.files;
    if (files.length === 0) {
      showNotification('Please select files to upload', 'error');
      return;
    }
    
    // Show progress
    uploadProgress.classList.remove('hidden');
    uploadResult.classList.add('hidden');
    selectedFilesDiv.classList.add('hidden');
    
    // Create FormData and append files
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    
    try {
      // Track upload progress
      const xhr = new XMLHttpRequest();
      xhr.open('POST', API.uploadFile, true);
      xhr.setRequestHeader('X-API-Key', API_KEY);
      
      // Update progress bar
      xhr.upload.addEventListener('progress', function(e) {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          progressBar.style.width = percentComplete + '%';
          progressBar.textContent = percentComplete + '%';
          uploadStatus.textContent = `Uploading... ${formatBytes(e.loaded)} of ${formatBytes(e.total)}`;
        }
      });
      
      // Handle response
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          
          if (response.success) {
            // Show success message
            uploadStatus.textContent = 'Upload completed successfully!';
            showNotification('Files uploaded successfully', 'success');
            
            // Show result
            uploadResult.classList.remove('hidden');
            resultList.innerHTML = '';
            
            // Display file info
            const fileInfo = document.createElement('div');
            fileInfo.className = 'bg-gray-50 rounded-lg p-4';
            fileInfo.innerHTML = `
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-700">${response.fileName}</span>
                <span class="text-sm text-gray-500">${formatBytes(response.size)}</span>
              </div>
              <div class="text-sm">
                <p class="text-gray-600">Download URL: <a href="${response.downloadUrl}" class="text-indigo-600 hover:text-indigo-800" target="_blank">${response.downloadUrl}</a></p>
                <p class="text-gray-600">File ID: ${response.fileId}</p>
              </div>
            `;
            resultList.appendChild(fileInfo);
            
            // Reset form
            uploadForm.reset();
            fileList.innerHTML = '';
            
            // Reload files list
            loadFiles();
            loadDashboardStats();
          } else {
            uploadStatus.textContent = 'Upload failed: ' + (response.message || 'Unknown error');
            showNotification('Upload failed: ' + (response.message || 'Unknown error'), 'error');
          }
        } else {
          uploadStatus.textContent = 'Upload failed: Server error';
          showNotification('Upload failed: Server error', 'error');
        }
      };
      
      xhr.onerror = function() {
        uploadStatus.textContent = 'Upload failed: Network error';
        showNotification('Upload failed: Network error', 'error');
      };
      
      // Send the upload
      xhr.send(formData);
    } catch (err) {
      console.error('Error uploading files:', err);
      uploadStatus.textContent = 'Upload failed: ' + err.message;
      showNotification('Upload failed: ' + err.message, 'error');
    }
  });
}

// Helper function for API calls
async function fetchAPI(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    }
  };
  
  const response = await fetch(endpoint, { ...defaultOptions, ...options });
  return response.json();
}

// Format bytes to human-readable form
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Format date to readable form
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

// Dashboard stats
async function loadDashboardStats() {
  try {
    const statsContainer = document.getElementById('stats-cards');
    statsContainer.innerHTML = '<p class="text-center py-8">Loading stats...</p>';
    
    const data = await fetchAPI(API.stats);
    
    if (data.success) {
      const { files, shares, system } = data.stats;
      
      statsContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Files</h3>
            <div class="text-3xl font-bold text-primary-600 mb-2">${files.count}</div>
            <div class="text-sm text-gray-600">
              <div class="flex justify-between mb-1">
                <span>Total Size:</span>
                <span>${formatBytes(files.totalSize)}</span>
              </div>
              <div class="flex justify-between">
                <span>Total Downloads:</span>
                <span>${files.totalDownloads}</span>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Shares</h3>
            <div class="text-3xl font-bold text-primary-600 mb-2">${shares.count}</div>
            <div class="text-sm text-gray-600">
              <div class="flex justify-between">
                <span>Total Downloads:</span>
                <span>${shares.totalDownloads}</span>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">System</h3>
            <div class="text-3xl font-bold text-primary-600 mb-2">${formatBytes(system.diskUsage)}</div>
            <div class="text-sm text-gray-600">
              <div class="flex justify-between mb-1">
                <span>Storage Used:</span>
                <span>${formatBytes(system.diskUsage)}</span>
              </div>
              <div class="flex justify-between">
                <span>Uptime:</span>
                <span>${Math.floor(system.uptime / 60)} minutes</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      statsContainer.innerHTML = '<p class="text-center py-8 text-red-600">Failed to load stats</p>';
    }
  } catch (err) {
    console.error('Error loading stats:', err);
    document.getElementById('stats-cards').innerHTML = 
      '<p class="text-center py-8 text-red-600">Error loading stats</p>';
  }
}

// Files management
async function loadFiles() {
  try {
    const filesContainer = document.getElementById('files-list');
    filesContainer.innerHTML = '<p class="text-center py-8">Loading files...</p>';
    
    const data = await fetchAPI(API.files);
    
    if (data.success) {
      if (data.files.length === 0) {
        filesContainer.innerHTML = '<p class="text-center py-8 text-gray-600">No files found</p>';
        return;
      }
      
      let tableHTML = `
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
      `;
      
      data.files.forEach(file => {
        tableHTML += `
          <tr>
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${file.name}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${formatBytes(file.size)}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${file.type || 'Unknown'}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(file.uploadDate)}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${file.downloads}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                class="text-red-600 hover:text-red-900 delete-file-btn"
                data-file-id="${file.id}"
                data-file-name="${file.name}"
              >
                Delete
              </button>
            </td>
          </tr>
        `;
      });
      
      tableHTML += `
            </tbody>
          </table>
        </div>
      `;
      
      filesContainer.innerHTML = tableHTML;
      
      // Add event listeners to delete buttons
      document.querySelectorAll('.delete-file-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
          const fileId = this.getAttribute('data-file-id');
          const fileName = this.getAttribute('data-file-name');
          
          if (confirm(`Are you sure you want to delete the file "${fileName}"?`)) {
            await deleteFile(fileId);
            loadFiles(); // Reload the files list
          }
        });
      });
    } else {
      filesContainer.innerHTML = '<p class="text-center py-8 text-red-600">Failed to load files</p>';
    }
  } catch (err) {
    console.error('Error loading files:', err);
    document.getElementById('files-list').innerHTML = 
      '<p class="text-center py-8 text-red-600">Error loading files</p>';
  }
}

// Delete a file
async function deleteFile(fileId) {
  try {
    const response = await fetchAPI(API.deleteFile(fileId), {
      method: 'DELETE'
    });
    
    if (response.success) {
      showNotification('File deleted successfully', 'success');
    } else {
      showNotification('Failed to delete file', 'error');
    }
  } catch (err) {
    console.error('Error deleting file:', err);
    showNotification('Error deleting file', 'error');
  }
}

// Shares management
async function loadShares() {
  try {
    const sharesContainer = document.getElementById('shares-list');
    sharesContainer.innerHTML = '<p class="text-center py-8">Loading shares...</p>';
    
    const data = await fetchAPI(API.shares);
    
    if (data.success) {
      if (data.shares.length === 0) {
        sharesContainer.innerHTML = '<p class="text-center py-8 text-gray-600">No shares found</p>';
        return;
      }
      
      let tableHTML = `
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Files</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
      `;
      
      data.shares.forEach(share => {
        tableHTML += `
          <tr>
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${share.id}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
              ${share.fileCount} file(s)
              <div class="text-xs text-gray-400">
                ${share.files.map(file => file.name).join(', ')}
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(share.createdAt)}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
              ${share.expiresAt ? formatDate(share.expiresAt) : 'Never'}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${share.downloads}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                class="text-red-600 hover:text-red-900 delete-share-btn"
                data-share-id="${share.id}"
              >
                Delete
              </button>
            </td>
          </tr>
        `;
      });
      
      tableHTML += `
            </tbody>
          </table>
        </div>
      `;
      
      sharesContainer.innerHTML = tableHTML;
      
      // Add event listeners to delete buttons
      document.querySelectorAll('.delete-share-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
          const shareId = this.getAttribute('data-share-id');
          
          if (confirm(`Are you sure you want to delete the share "${shareId}"?`)) {
            await deleteShare(shareId);
            loadShares(); // Reload the shares list
          }
        });
      });
    } else {
      sharesContainer.innerHTML = '<p class="text-center py-8 text-red-600">Failed to load shares</p>';
    }
  } catch (err) {
    console.error('Error loading shares:', err);
    document.getElementById('shares-list').innerHTML = 
      '<p class="text-center py-8 text-red-600">Error loading shares</p>';
  }
}

// Delete a share
async function deleteShare(shareId) {
  try {
    const response = await fetchAPI(API.deleteShare(shareId), {
      method: 'DELETE'
    });
    
    if (response.success) {
      showNotification('Share deleted successfully', 'success');
    } else {
      showNotification('Failed to delete share', 'error');
    }
  } catch (err) {
    console.error('Error deleting share:', err);
    showNotification('Error deleting share', 'error');
  }
}

// System cleanup
async function runCleanup() {
  try {
    document.getElementById('cleanup-btn').disabled = true;
    document.getElementById('cleanup-btn').innerHTML = 'Running...';
    
    const data = await fetchAPI(API.cleanup, {
      method: 'POST'
    });
    
    if (data.success) {
      const results = data.results;
      
      let message = 'Cleanup completed: ';
      message += `${results.expiredShares} expired shares, `;
      message += `${results.orphanedFiles} orphaned files, `;
      message += `${results.tempFiles} temp files cleaned up`;
      
      showNotification(message, 'success');
      
      // Reload stats and file lists to reflect changes
      loadDashboardStats();
      loadFiles();
      loadShares();
    } else {
      showNotification('Failed to run cleanup', 'error');
    }
  } catch (err) {
    console.error('Error running cleanup:', err);
    showNotification('Error running cleanup', 'error');
  } finally {
    document.getElementById('cleanup-btn').disabled = false;
    document.getElementById('cleanup-btn').innerHTML = 'Run Cleanup';
  }
}

// Tab navigation
function setupTabNavigation() {
  const tabs = document.querySelectorAll('.tab-link');
  const tabContents = document.querySelectorAll('[data-tab-content]');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default anchor behavior
      
      const target = document.querySelector(tab.dataset.tabTarget);
      
      // Hide all tab contents
      tabContents.forEach(content => {
        content.classList.add('hidden');
      });
      
      // Remove active class from all tabs
      tabs.forEach(t => {
        t.classList.remove('bg-indigo-700');
        t.classList.add('hover:bg-indigo-700');
      });
      
      // Show the selected tab content
      target.classList.remove('hidden');
      
      // Add active class to selected tab
      tab.classList.add('bg-indigo-700');
      tab.classList.remove('hover:bg-indigo-700');
      
      // Load data for the selected tab
      const tabId = tab.dataset.tabTarget.substring(1);
      if (tabId === 'dashboard') {
        loadDashboardStats();
      } else if (tabId === 'files') {
        loadFiles();
      } else if (tabId === 'shares') {
        loadShares();
      }
    });
  });
}

// Socket.io listeners for real-time updates
function setupSocketListeners() {
  const socket = io();
  
  socket.on('fileUploaded', () => {
    // Refresh files tab data if it's active
    if (!document.getElementById('files').classList.contains('hidden')) {
      loadFiles();
    }
    // Always update dashboard stats
    loadDashboardStats();
  });
  
  socket.on('fileDownloaded', () => {
    // Always update dashboard stats for download counts
    loadDashboardStats();
  });
  
  socket.on('shareCreated', () => {
    // Refresh shares tab data if it's active
    if (!document.getElementById('shares').classList.contains('hidden')) {
      loadShares();
    }
    // Always update dashboard stats
    loadDashboardStats();
  });
  
  socket.on('adminFileDeleted', () => {
    // Refresh all relevant data
    loadDashboardStats();
    loadFiles();
    loadShares(); // In case files in shares were affected
  });
  
  socket.on('adminShareDeleted', () => {
    // Refresh shares data
    loadDashboardStats();
    loadShares();
  });
}

// Share creation functionality
function setupShareCreation() {
  const createShareBtn = document.getElementById('create-share-btn');
  const shareModal = document.getElementById('share-modal');
  const closeShareModalBtn = document.getElementById('close-share-modal');
  const shareForm = document.getElementById('share-form');
  const fileSelect = document.getElementById('file-select');
  
  // Populate file select when opening modal
  createShareBtn.addEventListener('click', async () => {
    // Show modal
    shareModal.classList.remove('hidden');
    
    // Clear previous options
    fileSelect.innerHTML = '';
    
    try {
      // Fetch files
      const data = await fetchAPI(API.files);
      
      if (data.success && data.files.length > 0) {
        // Add file options
        data.files.forEach(file => {
          const option = document.createElement('option');
          option.value = file.id;
          option.textContent = `${file.name} (${formatBytes(file.size)})`;
          fileSelect.appendChild(option);
        });
      } else {
        // No files message
        const option = document.createElement('option');
        option.disabled = true;
        option.textContent = 'No files available';
        fileSelect.appendChild(option);
      }
    } catch (err) {
      console.error('Error loading files for share:', err);
      // Error message
      const option = document.createElement('option');
      option.disabled = true;
      option.textContent = 'Error loading files';
      fileSelect.appendChild(option);
    }
  });
  
  // Close modal
  closeShareModalBtn.addEventListener('click', () => {
    shareModal.classList.add('hidden');
  });
  
  // Close modal if clicked outside
  shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) {
      shareModal.classList.add('hidden');
    }
  });
  
  // Handle form submission
  shareForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get selected file IDs
    const selectedFiles = Array.from(fileSelect.selectedOptions).map(option => option.value);
    
    if (selectedFiles.length === 0) {
      showNotification('Please select at least one file', 'error');
      return;
    }
    
    // Get expiry time
    const expiryTime = document.getElementById('expiry-time').value;
    
    try {
      const response = await fetchAPI(API.createShare, {
        method: 'POST',
        body: JSON.stringify({
          fileIds: selectedFiles,
          expiryTime: expiryTime ? parseInt(expiryTime) : null
        })
      });
      
      if (response.success) {
        // Close modal
        shareModal.classList.add('hidden');
        
        // Show success message
        showNotification('Share created successfully', 'success');
        
        // Reload shares
        loadShares();
        
        // Show share URL with a more detailed notification
        const shareInfo = document.createElement('div');
        shareInfo.innerHTML = `
          <p class="mb-2"><strong>Share created:</strong></p>
          <p class="mb-1 break-all"><a href="${response.shareUrl}" target="_blank" class="text-indigo-600 hover:underline">${response.shareUrl}</a></p>
          <p class="text-xs mt-1">ID: ${response.shareId}</p>
        `;
        
        showCustomNotification(shareInfo, 'success', 10000); // Keep visible for 10 seconds
      } else {
        showNotification('Failed to create share: ' + (response.message || 'Unknown error'), 'error');
      }
    } catch (err) {
      console.error('Error creating share:', err);
      showNotification('Error creating share: ' + err.message, 'error');
    }
  });
}

// Show a custom notification with HTML content
function showCustomNotification(content, type = 'info', duration = 5000) {
  const container = document.getElementById('notification-container');
  
  const notification = document.createElement('div');
  notification.className = `notification ${type} bg-white rounded-md shadow-md p-4 mb-4`;
  
  let bgColor = 'bg-blue-100 border-blue-500';
  let textColor = 'text-blue-800';
  
  if (type === 'success') {
    bgColor = 'bg-green-100 border-green-500';
    textColor = 'text-green-800';
  } else if (type === 'error') {
    bgColor = 'bg-red-100 border-red-500';
    textColor = 'text-red-800';
  }
  
  notification.classList.add(bgColor, textColor, 'border-l-4');
  
  // Create wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'flex items-center justify-between';
  
  // Content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'flex-1 mr-4';
  contentContainer.appendChild(content);
  
  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'ml-4 text-gray-500 hover:text-gray-700 close-btn';
  closeBtn.innerHTML = `
    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
    </svg>
  `;
  
  // Add close button functionality
  closeBtn.addEventListener('click', function() {
    notification.remove();
  });
  
  // Assemble notification
  wrapper.appendChild(contentContainer);
  wrapper.appendChild(closeBtn);
  notification.appendChild(wrapper);
  
  // Auto-remove after specified duration
  setTimeout(() => {
    notification.remove();
  }, duration);
  
  container.appendChild(notification);
}

// Show notification
function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  
  const notification = document.createElement('div');
  notification.className = `notification ${type} bg-white rounded-md shadow-md p-4 mb-4`;
  
  let bgColor = 'bg-blue-100 border-blue-500';
  let textColor = 'text-blue-800';
  
  if (type === 'success') {
    bgColor = 'bg-green-100 border-green-500';
    textColor = 'text-green-800';
  } else if (type === 'error') {
    bgColor = 'bg-red-100 border-red-500';
    textColor = 'text-red-800';
  }
  
  notification.classList.add(bgColor, textColor, 'border-l-4');
  
  notification.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <p>${message}</p>
      </div>
      <button class="ml-4 text-gray-500 hover:text-gray-700 close-btn">
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  `;
  
  // Add close button functionality
  notification.querySelector('.close-btn').addEventListener('click', function() {
    notification.remove();
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
  
  container.appendChild(notification);
}

// Login/Logout functionality
function setupAuthentication() {
  const loginForm = document.getElementById('login-form');
  const adminPanel = document.getElementById('admin-panel');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  
  // Admin password (in a real app, this would be authenticated server-side)
  const ADMIN_PASSWORD = 'admin123';
  
  // Check if already logged in
  if (localStorage.getItem('adminLoggedIn') === 'true') {
    loginForm.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    
    // Initialize admin panel
    initializeAdminPanel();
  }
  
  // Login button click handler
  loginBtn.addEventListener('click', function() {
    if (passwordInput.value === ADMIN_PASSWORD) {
      // Successful login
      localStorage.setItem('adminLoggedIn', 'true');
      loginForm.classList.add('hidden');
      adminPanel.classList.remove('hidden');
      errorMessage.classList.add('hidden');
      
      // Initialize admin panel
      initializeAdminPanel();
    } else {
      // Failed login
      errorMessage.classList.remove('hidden');
      passwordInput.value = '';
    }
  });
  
  // Logout button click handler
  logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('adminLoggedIn');
    adminPanel.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });
  
  // Allow Enter key to submit the form
  passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      loginBtn.click();
    }
  });
}

// Initialize the admin panel
function initializeAdminPanel() {
  // Set up theme toggle
  setupThemeToggle();
  
  // Set up tab navigation
  setupTabNavigation();
  
  // Load dashboard data (default tab)
  loadDashboardStats();
  
  // Set up cleanup button
  document.getElementById('cleanup-btn').addEventListener('click', runCleanup);
  
  // Set up real-time updates with socket.io
  setupSocketListeners();
  
  // Set up refresh buttons
  document.querySelectorAll('.refresh-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tabId = this.getAttribute('data-refresh-target');
      if (tabId === 'dashboard') {
        loadDashboardStats();
      } else if (tabId === 'files') {
        loadFiles();
      } else if (tabId === 'shares') {
        loadShares();
      }
    });
  });
  
  // Set up file upload functionality
  setupFileUpload();
  
  // Set up share creation functionality
  setupShareCreation();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  setupAuthentication();
}); 