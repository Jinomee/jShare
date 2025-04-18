<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-secondary-800">My Shares</h1>
      <router-link to="/files" class="btn btn-primary">
        Create New Share
      </router-link>
    </div>
    
    <div class="card p-6">
      <div v-if="loading" class="text-center py-8">
        <svg class="animate-spin h-10 w-10 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-4 text-secondary-600">Loading shares...</p>
      </div>
      
      <div v-else-if="shares.length === 0" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-secondary-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <h2 class="text-xl font-semibold text-secondary-700 mb-2">No Shares Yet</h2>
        <p class="text-secondary-500 mb-6">Create a share link for your files to get started.</p>
        <router-link to="/files" class="btn btn-primary">
          Go to Files
        </router-link>
      </div>
      
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-secondary-200">
            <thead class="bg-secondary-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Share ID
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Files
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Expires
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
              <tr v-for="share in shares" :key="share.id" class="hover:bg-secondary-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-secondary-900">
                    {{ share.id }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-secondary-500">
                    {{ share.files.length }} file(s)
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-secondary-500">{{ formatDate(share.createdAt) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="share.expiresAt" class="text-sm text-secondary-500">
                    {{ formatDate(share.expiresAt) }}
                  </div>
                  <div v-else class="text-sm text-secondary-500">
                    Never
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-secondary-500">{{ share.downloads }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-3">
                    <button @click="copyShareUrl(share)" class="text-primary-600 hover:text-primary-900" title="Copy Link">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <router-link :to="`/share/${share.id}`" class="text-primary-600 hover:text-primary-900" title="View">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </router-link>
                    <button @click="confirmDelete(share)" class="text-red-600 hover:text-red-900" title="Delete">
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
          Are you sure you want to delete this share? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="deleteShare" class="btn btn-danger">
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
  name: 'Shares',
  setup() {
    const store = useStore()
    const toast = useToast()
    
    const showDeleteModal = ref(false)
    const selectedShare = ref(null)
    
    const loading = computed(() => store.state.loading)
    const shares = computed(() => store.state.shares)
    
    onMounted(() => {
      fetchShares()
    })
    
    const fetchShares = async () => {
      try {
        await store.dispatch('fetchShares')
      } catch (error) {
        toast.error('Failed to load shares')
      }
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return 'Never'
      
      const date = new Date(dateString)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    const copyShareUrl = (share) => {
      const shareUrl = `${window.location.origin}/share/${share.id}`
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast.success('Share link copied to clipboard!')
        })
        .catch(() => {
          toast.error('Failed to copy share link')
        })
    }
    
    const confirmDelete = (share) => {
      selectedShare.value = share
      showDeleteModal.value = true
    }
    
    const deleteShare = async () => {
      if (!selectedShare.value) return
      
      try {
        await store.dispatch('deleteShare', selectedShare.value.id)
        toast.success('Share deleted successfully')
        showDeleteModal.value = false
      } catch (error) {
        toast.error('Failed to delete share')
      }
    }
    
    return {
      loading,
      shares,
      showDeleteModal,
      formatDate,
      copyShareUrl,
      confirmDelete,
      deleteShare
    }
  }
}
</script>
