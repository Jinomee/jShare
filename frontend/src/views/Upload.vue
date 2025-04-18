<template>
  <div class="max-w-4xl mx-auto">
    <!-- Upload Container -->
    <div 
      class="card p-6 mb-6 border-2 border-dashed border-secondary-300 rounded-lg"
      :class="{ 'border-primary-400 bg-primary-50': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <div v-if="Array.isArray(selectedFiles) && selectedFiles.length === 0 && !uploading" class="text-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-secondary-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <h2 class="text-xl font-semibold text-secondary-700 mb-2">Drop files here</h2>
        <p class="text-secondary-500 mb-4">or</p>
        <label class="btn btn-primary cursor-pointer">
          Select Files
          <input 
            type="file" 
            class="hidden" 
            multiple 
            @change="onFileSelected"
          >
        </label>
        <p class="text-sm text-secondary-500 mt-4">Maximum file size: 1GB</p>
      </div>
      
      <div v-else-if="uploading" class="text-center py-8">
        <div class="mb-4">
          <svg class="animate-spin h-10 w-10 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-secondary-700 mb-2">Uploading...</h2>
        <div class="w-full bg-secondary-200 rounded-full h-2.5 mb-4">
          <div class="bg-primary-600 h-2.5 rounded-full" :style="{ width: `${uploadProgress}%` }"></div>
        </div>
        <div class="flex flex-col space-y-1">
          <p class="text-secondary-500">{{ uploadProgress }}% complete</p>
          <p class="text-secondary-500 text-sm">Speed: {{ uploadSpeed }} KB/s</p>
          <p class="text-secondary-500 text-sm">{{ currentFileIndex + 1 }} of {{ totalFiles }}</p>
        </div>
      </div>
      
      <div v-else class="py-4">
        <h2 class="text-lg font-semibold text-secondary-700 mb-4">Selected Files</h2>
        <ul class="space-y-2 mb-6">
          <li 
            v-for="(file, index) in selectedFiles" 
            :key="index"
            class="flex items-center justify-between bg-secondary-50 p-3 rounded-md"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-secondary-700 truncate max-w-xs">{{ file.name }}</span>
              <span class="text-xs text-secondary-500 ml-2">({{ formatFileSize(file.size) }})</span>
            </div>
            <button 
              @click="removeFile(index)" 
              class="text-secondary-500 hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        </ul>
        <div class="flex space-x-4 justify-center">
          <button @click="selectedFiles = []" class="btn btn-secondary">
            Clear
          </button>
          <button @click="uploadFiles" class="btn btn-primary">
            Upload
          </button>
        </div>
      </div>
    </div>
    
    <!-- Files List -->
    <div class="card p-6">
      <div v-if="loading" class="text-center py-6">
        <svg class="animate-spin h-8 w-8 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-secondary-600">Loading files...</p>
      </div>
      
      <div v-else-if="Array.isArray(files) && files.length === 0 && Array.isArray(uploadedFiles) && uploadedFiles.length === 0" class="text-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-secondary-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <p class="text-secondary-600">No files yet. Upload some files to get started.</p>
      </div>
      
      <div v-else>
        <h2 class="text-lg font-semibold text-secondary-700 mb-4">Your Files</h2>
        <ul class="space-y-2">
          <li 
            v-for="file in allFiles" 
            :key="file.id"
            class="flex items-center justify-between bg-white border border-secondary-200 p-3 rounded-md hover:bg-secondary-50"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <span class="text-secondary-700 truncate max-w-xs block">{{ file.name }}</span>
                <span class="text-xs text-secondary-500">{{ formatFileSize(file.size) }}</span>
              </div>
            </div>
            <div class="flex space-x-2">
              <button @click="downloadFile(file)" class="btn-icon text-secondary-600 hover:text-primary-600" title="Download">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </button>
              <button @click="openShareModal(file)" class="btn-icon text-secondary-600 hover:text-primary-600" title="Share">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </button>
              <button @click="openDeleteModal(file)" class="btn-icon text-secondary-600 hover:text-red-600" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Share Modal -->
    <div v-if="showShareModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-secondary-900">Share File</h3>
          <button @click="showShareModal = false" class="text-secondary-500 hover:text-secondary-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mb-4">
          <p class="text-secondary-600 mb-2">Share <strong>{{ selectedFile?.name }}</strong></p>
          <div class="flex">
            <input 
              type="text" 
              :value="shareUrl" 
              readonly 
              class="input rounded-r-none flex-grow"
            />
            <button 
              @click="copyShareUrl" 
              class="bg-primary-600 text-white px-4 rounded-r-md hover:bg-primary-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex justify-end">
          <button @click="showShareModal = false" class="btn btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-secondary-900">Delete File</h3>
          <button @click="showDeleteModal = false" class="text-secondary-500 hover:text-secondary-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-secondary-600 mb-4">
          Are you sure you want to delete <strong>{{ selectedFile?.name }}</strong>?
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="deleteFile" class="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'

export default {
  name: 'Upload',
  setup() {
    const store = useStore()
    const toast = useToast()
    
    // Upload state
    const isDragging = ref(false)
    const selectedFiles = ref([])
    const uploadedFiles = ref([])
    const uploading = ref(false)
    const uploadProgress = ref(0)
    const uploadSpeed = ref(0)
    const currentFileIndex = ref(0)
    const totalFiles = ref(0)
    const lastUploadedBytes = ref(0)
    const lastUploadTime = ref(0)
    
    // File management state
    const loading = ref(true)
    const showShareModal = ref(false)
    const showDeleteModal = ref(false)
    const selectedFile = ref(null)
    const shareUrl = ref('')
    
    // Get files from store
    const files = computed(() => {
      const storeFiles = store.state.files;
      return Array.isArray(storeFiles) ? storeFiles : [];
    })
    
    // Combine uploaded files and files from store
    const allFiles = computed(() => {
      // Create a map of file IDs from the store
      const fileArray = Array.isArray(files.value) ? files.value : [];
      const uploadedArray = Array.isArray(uploadedFiles.value) ? uploadedFiles.value : [];
      
      const fileMap = new Map();
      
      // Add files from store
      fileArray.forEach(file => {
        if (file && file.id) {
          fileMap.set(file.id, file);
        }
      });
      
      // Add any newly uploaded files that aren't in the store yet
      uploadedArray.forEach(file => {
        if (file && file.id && !fileMap.has(file.id)) {
          fileMap.set(file.id, file);
        }
      });
      
      // Convert map back to array and sort by newest first
      return Array.from(fileMap.values())
        .sort((a, b) => {
          const dateA = a && a.uploadDate ? new Date(a.uploadDate) : new Date();
          const dateB = b && b.uploadDate ? new Date(b.uploadDate) : new Date();
          return dateB - dateA;
        });
    })
    
    // Load files on component mount
    onMounted(async () => {
      await fetchFiles()
    })
    
    const fetchFiles = async () => {
      loading.value = true
      try {
        await store.dispatch('fetchFiles')
      } catch (error) {
        toast.error('Failed to load files')
      } finally {
        loading.value = false
      }
    }
    
    // Upload functionality
    const onDrop = (e) => {
      isDragging.value = false
      const files = e.dataTransfer.files
      if (files.length) {
        addFiles(files)
      }
    }
    
    const onFileSelected = (e) => {
      const files = e.target.files
      if (files.length) {
        addFiles(files)
      }
    }
    
    const addFiles = (files) => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Check file size (1GB max)
        if (file.size > 1024 * 1024 * 1024) {
          toast.error(`File "${file.name}" exceeds the 1GB size limit.`)
          continue
        }
        
        selectedFiles.value.push(file)
      }
    }
    
    const removeFile = (index) => {
      selectedFiles.value.splice(index, 1)
    }
    
    const uploadFiles = async () => {
      if (!Array.isArray(selectedFiles.value) || selectedFiles.value.length === 0) return;
      
      console.log('Starting upload process with files:', selectedFiles.value);
      uploading.value = true;
      uploadProgress.value = 0;
      uploadSpeed.value = 0;
      currentFileIndex.value = 0;
      totalFiles.value = selectedFiles.value.length;
      lastUploadedBytes.value = 0;
      lastUploadTime.value = Date.now();
      
      try {
        for (let i = 0; i < selectedFiles.value.length; i++) {
          currentFileIndex.value = i;
          const file = selectedFiles.value[i];
          if (!file) continue;
          
          console.log('Uploading file:', file.name, 'size:', file.size);
          const formData = new FormData();
          formData.append('file', file);
          
          // Set up upload progress tracking
          const onUploadProgress = (progressEvent) => {
            console.log('Upload progress:', progressEvent.loaded, '/', progressEvent.total);
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            uploadProgress.value = percentCompleted;
            
            // Calculate upload speed (KB/s)
            const currentTime = Date.now();
            const timeElapsed = currentTime - lastUploadTime.value;
            
            if (timeElapsed > 100) { // Update speed every 100ms
              const bytesUploaded = progressEvent.loaded - lastUploadedBytes.value;
              const speedKBps = Math.round((bytesUploaded / 1024) / (timeElapsed / 1000));
              uploadSpeed.value = speedKBps > 0 ? speedKBps : 0;
              
              lastUploadedBytes.value = progressEvent.loaded;
              lastUploadTime.value = currentTime;
            }
          };
          
          console.log('Dispatching uploadFile action')
          const response = await store.dispatch('uploadFile', { formData, onUploadProgress })
          console.log('Upload successful, response:', response)
          uploadedFiles.value.unshift({
            id: response.fileId,
            name: response.fileName,
            size: response.size,
            downloadUrl: response.downloadUrl,
            uploadDate: new Date()
          })
          
          // Emit socket event for real-time updates
          if (store.getters.getSocket && store.getters.isSocketConnected) {
            store.getters.getSocket.emit('uploadProgress', {
              fileName: file.name,
              fileSize: file.size,
              progress: 100
            })
          }
        }
        
        uploadProgress.value = 100
        toast.success(`Successfully uploaded ${selectedFiles.value.length} file(s)`)
        selectedFiles.value = []
      } catch (error) {
        toast.error('Error uploading files: ' + (error.message || 'Unknown error'))
      } finally {
        uploading.value = false
      }
    }
    
    // File management functionality
    const shareFile = (file) => {
      selectedFile.value = file
      shareUrl.value = `${window.location.origin}/share/${file.id}`
      showShareModal.value = true
    }
    
    const copyShareUrl = () => {
      navigator.clipboard.writeText(shareUrl.value)
        .then(() => {
          toast.success('Share link copied to clipboard!')
        })
        .catch(() => {
          toast.error('Failed to copy share link')
        })
    }
    
    const copyShareLink = (file) => {
      const shareUrl = `${window.location.origin}/share/${file.id}`
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast.success('Share link copied to clipboard!')
        })
        .catch(() => {
          toast.error('Failed to copy share link')
        })
    }
    
    const confirmDelete = (file) => {
      selectedFile.value = file
      showDeleteModal.value = true
    }
    
    const deleteFile = async () => {
      if (!selectedFile.value) return
      
      try {
        await store.dispatch('deleteFile', selectedFile.value.id)
        toast.success('File deleted successfully')
        showDeleteModal.value = false
        
        // Remove from uploadedFiles if it exists there
        const index = uploadedFiles.value.findIndex(f => f.id === selectedFile.value.id)
        if (index !== -1) {
          uploadedFiles.value.splice(index, 1)
        }
      } catch (error) {
        toast.error('Failed to delete file')
      }
    }
    
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    
    // Add missing functions
    const downloadFile = (file) => {
      window.location.href = `/api/files/download/${file.id}`
    }
    
    const openShareModal = (file) => {
      selectedFile.value = file
      shareUrl.value = `${window.location.origin}/share/${file.id}`
      showShareModal.value = true
    }
    
    const createShareLink = async () => {
      if (!selectedFile.value) return
      
      try {
        const response = await store.dispatch('createShare', {
          fileIds: [selectedFile.value.id],
          expiryTime: null
        })
        
        shareUrl.value = `${window.location.origin}/share/${response.id}`
        toast.success('Share link created')
      } catch (error) {
        toast.error('Failed to create share link')
      }
    }
    
    const openDeleteModal = (file) => {
      selectedFile.value = file
      showDeleteModal.value = true
    }
    
    return {
      isDragging,
      selectedFiles,
      uploading,
      uploadProgress,
      uploadSpeed,
      currentFileIndex,
      totalFiles,
      loading,
      files,
      uploadedFiles,
      allFiles,
      showShareModal,
      showDeleteModal,
      selectedFile,
      shareUrl,
      onDrop,
      onDragOver: () => isDragging.value = true,
      onDragLeave: () => isDragging.value = false,
      onFileSelected,
      removeFile,
      uploadFiles,
      formatFileSize,
      downloadFile,
      openShareModal,
      createShareLink,
      copyShareUrl,
      openDeleteModal,
      deleteFile,
      formatDate: (date) => new Date(date).toLocaleString()
    }
  }
}
</script>
