<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-secondary-800">My Files</h1>
      <router-link to="/upload" class="btn btn-primary">
        Upload New Files
      </router-link>
    </div>
    
    <div class="card p-6">
      <div v-if="loading" class="text-center py-8">
        <svg class="animate-spin h-10 w-10 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-4 text-secondary-600">Loading files...</p>
      </div>
      
      <div v-else-if="files.length === 0" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-secondary-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h2 class="text-xl font-semibold text-secondary-700 mb-2">No Files Yet</h2>
        <p class="text-secondary-500 mb-6">Upload some files to get started.</p>
        <router-link to="/upload" class="btn btn-primary">
          Upload Files
        </router-link>
      </div>
      
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-secondary-200">
            <thead class="bg-secondary-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  File Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Downloads
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-secondary-200">
              <tr v-for="file in files" :key="file.id" class="hover:bg-secondary-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div class="text-sm font-medium text-secondary-900 truncate max-w-xs">
                      {{ file.name }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-secondary-500">{{ formatFileSize(file.size) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-secondary-500">{{ formatDate(file.uploadDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-secondary-500">{{ file.downloads }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-3">
                    <a :href="`/api/files/download/${file.id}`" class="text-primary-600 hover:text-primary-900" title="Download">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                    <button @click="shareFile(file)" class="text-primary-600 hover:text-primary-900" title="Share">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                    <button @click="confirmDelete(file)" class="text-red-600 hover:text-red-900" title="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="flex justify-between items-center mt-6">
          <div class="text-sm text-secondary-500">
            Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to 
            {{ Math.min(pagination.page * pagination.limit, pagination.totalFiles) }} 
            of {{ pagination.totalFiles }} files
          </div>
          <div class="flex space-x-2">
            <button 
              @click="changePage(pagination.page - 1)" 
              :disabled="pagination.page === 1"
              class="btn btn-secondary"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.page === 1 }"
            >
              Previous
            </button>
            <button 
              @click="changePage(pagination.page + 1)" 
              :disabled="pagination.page === pagination.totalPages"
              class="btn btn-secondary"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.page === pagination.totalPages }"
            >
              Next
            </button>
          </div>
        </div>
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
        <div class="mb-4">
          <label class="block text-sm font-medium text-secondary-700 mb-1">
            Expiry Time (optional)
          </label>
          <select v-model="expiryTime" class="input">
            <option :value="null">Never expires</option>
            <option :value="3600">1 hour</option>
            <option :value="86400">1 day</option>
            <option :value="604800">1 week</option>
            <option :value="2592000">30 days</option>
          </select>
        </div>
        <div class="flex justify-end space-x-3">
          <button @click="showShareModal = false" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="createShareLink" class="btn btn-primary">
            Create Share Link
          </button>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-secondary-900">Confirm Delete</h3>
          <button @click="showDeleteModal = false" class="text-secondary-500 hover:text-secondary-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-secondary-600 mb-4">
          Are you sure you want to delete <strong>{{ selectedFile?.name }}</strong>? This action cannot be undone.
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
  name: 'Files',
  setup() {
    const store = useStore()
    const toast = useToast()
    
    const showShareModal = ref(false)
    const showDeleteModal = ref(false)
    const selectedFile = ref(null)
    const expiryTime = ref(null)
    const shareUrl = ref('')
    
    const loading = computed(() => store.state.loading)
    const files = computed(() => store.state.files)
    const pagination = computed(() => store.state.pagination)
    
    onMounted(() => {
      fetchFiles()
    })
    
    const fetchFiles = async () => {
      try {
        await store.dispatch('fetchFiles')
      } catch (error) {
        toast.error('Failed to load files')
      }
    }
    
    const changePage = (page) => {
      if (page < 1 || page > pagination.value.totalPages) return
      
      store.dispatch('fetchFiles', { page, limit: pagination.value.limit })
    }
    
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
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
    
    const createShareLink = async () => {
      if (!selectedFile.value) return
      
      try {
        const response = await store.dispatch('createShare', {
          fileIds: [selectedFile.value.id],
          expiryTime: expiryTime.value
        })
        
        shareUrl.value = response.shareUrl
        toast.success('Share link created successfully!')
        copyShareUrl()
      } catch (error) {
        toast.error('Failed to create share link')
      }
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
      } catch (error) {
        toast.error('Failed to delete file')
      }
    }
    
    return {
      loading,
      files,
      pagination,
      showShareModal,
      showDeleteModal,
      selectedFile,
      expiryTime,
      shareUrl,
      changePage,
      formatFileSize,
      formatDate,
      shareFile,
      copyShareUrl,
      createShareLink,
      confirmDelete,
      deleteFile
    }
  }
}
</script>
