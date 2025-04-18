import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    files: [],
    shares: [],
    loading: false,
    error: null,
    socket: null,
    socketConnected: false,
    activeUsers: 0,
    pagination: {
      page: 1,
      limit: 10,
      totalFiles: 0,
      totalPages: 0
    }
  },
  getters: {
    getFiles: state => state.files,
    getShares: state => state.shares,
    isLoading: state => state.loading,
    getError: state => state.error,
    getSocket: state => state.socket,
    isSocketConnected: state => state.socketConnected,
    getActiveUsers: state => state.activeUsers,
    getPagination: state => state.pagination
  },
  mutations: {
    setFiles(state, files) {
      state.files = files
    },
    setShares(state, shares) {
      state.shares = shares
    },
    setLoading(state, loading) {
      state.loading = loading
    },
    setError(state, error) {
      state.error = error
    },
    setSocket(state, socket) {
      state.socket = socket
    },
    setSocketConnected(state, connected) {
      state.socketConnected = connected
    },
    setActiveUsers(state, count) {
      state.activeUsers = count
    },
    setPagination(state, pagination) {
      state.pagination = pagination
    },
    addFile(state, file) {
      state.files.unshift(file)
    },
    removeFile(state, fileId) {
      state.files = state.files.filter(file => file.id !== fileId)
    },
    addShare(state, share) {
      state.shares.unshift(share)
    },
    removeShare(state, shareId) {
      state.shares = state.shares.filter(share => share.id !== shareId)
    }
  },
  actions: {
    // Fetch all files with pagination
    async fetchFiles({ commit }, { page = 1, limit = 10 } = {}) {
      commit('setLoading', true)
      try {
        const response = await axios.get(`/api/files?page=${page}&limit=${limit}`)
        commit('setFiles', response.data.files)
        commit('setPagination', response.data.pagination)
        commit('setError', null)
      } catch (error) {
        console.error('Error fetching files:', error)
        commit('setError', error.response?.data?.message || 'Failed to fetch files')
      } finally {
        commit('setLoading', false)
      }
    },
    
    // Refresh files (used after socket events)
    async refreshFiles({ dispatch, state }) {
      await dispatch('fetchFiles', {
        page: state.pagination.page,
        limit: state.pagination.limit
      })
    },
    
    // Upload a file
    async uploadFile({ commit }, { formData, onUploadProgress }) {
      commit('setLoading', true)
      try {
        // Let Axios set the Content-Type header automatically for FormData
        const response = await axios.post('/api/files/upload', formData, {
          onUploadProgress
        })
        commit('addFile', {
          id: response.data.fileId,
          name: response.data.fileName,
          size: response.data.size,
          downloadUrl: response.data.downloadUrl,
          uploadDate: new Date()
        })
        commit('setError', null)
        return response.data
      } catch (error) {
        console.error('Error uploading file:', error)
        commit('setError', error.response?.data?.message || 'Failed to upload file')
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    // Delete a file
    async deleteFile({ commit }, fileId) {
      commit('setLoading', true)
      try {
        await axios.delete(`/api/files/${fileId}`)
        commit('removeFile', fileId)
        commit('setError', null)
      } catch (error) {
        console.error('Error deleting file:', error)
        commit('setError', error.response?.data?.message || 'Failed to delete file')
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    // Fetch all shares
    async fetchShares({ commit }) {
      commit('setLoading', true)
      try {
        const response = await axios.get('/api/share')
        commit('setShares', response.data.shares)
        commit('setError', null)
      } catch (error) {
        console.error('Error fetching shares:', error)
        commit('setError', error.response?.data?.message || 'Failed to fetch shares')
      } finally {
        commit('setLoading', false)
      }
    },
    
    // Refresh shares (used after socket events)
    async refreshShares({ dispatch }) {
      await dispatch('fetchShares')
    },
    
    // Create a share
    async createShare({ commit }, { fileIds, expiryTime }) {
      commit('setLoading', true)
      try {
        const response = await axios.post('/api/share/create', {
          fileIds,
          expiryTime
        })
        commit('addShare', response.data)
        commit('setError', null)
        return response.data
      } catch (error) {
        console.error('Error creating share:', error)
        commit('setError', error.response?.data?.message || 'Failed to create share')
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    // Delete a share
    async deleteShare({ commit }, shareId) {
      commit('setLoading', true)
      try {
        await axios.delete(`/api/share/${shareId}`)
        commit('removeShare', shareId)
        commit('setError', null)
      } catch (error) {
        console.error('Error deleting share:', error)
        commit('setError', error.response?.data?.message || 'Failed to delete share')
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    // Get share info
    async getShareInfo({ commit }, shareId) {
      commit('setLoading', true)
      try {
        const response = await axios.get(`/api/share/${shareId}`)
        commit('setError', null)
        return response.data.share
      } catch (error) {
        console.error('Error getting share info:', error)
        commit('setError', error.response?.data?.message || 'Failed to get share info')
        throw error
      } finally {
        commit('setLoading', false)
      }
    }
  }
})
