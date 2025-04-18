<template>
  <div>
    <div class="card p-6 max-w-4xl mx-auto">
      <div v-if="loading" class="text-center py-12">
        <svg class="animate-spin h-10 w-10 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-4 text-secondary-600">Loading shared files...</p>
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 class="text-xl font-semibold text-secondary-800 mb-2">{{ error }}</h2>
        <p class="text-secondary-600 mb-6">This share link may have expired or been deleted.</p>
        <router-link to="/" class="btn btn-primary">
          Go Home
        </router-link>
      </div>
      
      <div v-else>
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-secondary-800 mb-2">Shared Files</h1>
          <p class="text-secondary-600">
            <span v-if="share.expiresAt">
              This share will expire on {{ formatDate(share.expiresAt) }}
            </span>
            <span v-else>
              This share does not expire
            </span>
          </p>
        </div>
        
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-secondary-800">Files ({{ share.files.length }})</h2>
            <a 
              :href="`/api/share/${shareId}/download`" 
              class="btn btn-primary flex items-center space-x-2"
              v-if="share.files.length > 1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download All</span>
            </a>
          </div>
          
          <ul class="space-y-3">
            <li 
              v-for="file in share.files" 
              :key="file.id"
              class="border border-secondary-200 rounded-lg p-4 flex justify-between items-center hover:bg-secondary-50"
            >
              <div class="flex items-center">
                <div class="bg-primary-100 rounded-lg p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-secondary-800">{{ file.name }}</h3>
                  <p class="text-sm text-secondary-500">{{ formatFileSize(file.size) }}</p>
                </div>
              </div>
              <a 
                :href="file.downloadUrl" 
                class="btn btn-secondary flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download</span>
              </a>
            </li>
          </ul>
        </div>
        
        <div class="border-t border-secondary-200 pt-6 flex justify-between items-center">
          <div class="text-sm text-secondary-500">
            Shared via <span class="font-semibold">jShare</span>
          </div>
          <router-link to="/upload" class="text-primary-600 hover:text-primary-800 text-sm font-medium">
            Share your own files
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import axios from 'axios'

export default {
  name: 'ShareView',
  props: {
    shareId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const route = useRoute()
    const store = useStore()
    const toast = useToast()
    
    const share = ref({
      id: '',
      createdAt: null,
      expiresAt: null,
      downloads: 0,
      files: []
    })
    
    const loading = ref(true)
    const error = ref(null)
    
    onMounted(async () => {
      try {
        await fetchShareInfo()
        
        // Join socket room for this share
        if (store.getters.getSocket && store.getters.isSocketConnected) {
          store.getters.getSocket.emit('joinShare', props.shareId)
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to load share'
      } finally {
        loading.value = false
      }
    })
    
    const fetchShareInfo = async () => {
      try {
        const response = await axios.get(`/api/share/${props.shareId}`)
        share.value = response.data.share
        
        // Get file list
        const filesResponse = await axios.get(`/api/share/${props.shareId}/files`)
        share.value.files = filesResponse.data.files
      } catch (error) {
        console.error('Error fetching share:', error)
        throw error
      }
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
    
    return {
      share,
      loading,
      error,
      formatFileSize,
      formatDate
    }
  },
  beforeUnmount() {
    // Leave socket room for this share
    if (this.$store.getters.getSocket && this.$store.getters.isSocketConnected) {
      this.$store.getters.getSocket.emit('leaveShare', this.shareId)
    }
  }
}
</script>
