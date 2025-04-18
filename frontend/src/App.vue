<template>
  <div class="min-h-screen flex flex-col bg-secondary-50">
    <Navbar />
    <main class="flex-grow container mx-auto px-4 py-6">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import { io } from 'socket.io-client'
import { useToast } from 'vue-toastification'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      socket: null
    }
  },
  created() {
    // Initialize socket connection
    this.initializeSocket()
    
    // Test axios connection to backend
    axios.get('/api/files')
      .then(response => {
        console.log('Backend connection successful:', response.data)
      })
      .catch(error => {
        console.error('Backend connection failed:', error)
      })
  },
  methods: {
    initializeSocket() {
      // Connect to socket.io server
      const socketUrl = process.env.NODE_ENV === 'production' 
        ? window.location.origin
        : 'http://localhost:3000'
      
      this.socket = io(socketUrl)
      
      // Store socket in Vuex for global access
      this.$store.commit('setSocket', this.socket)
      
      // Listen for socket connection events
      this.socket.on('connect', () => {
        console.log('Socket connected')
        this.$store.commit('setSocketConnected', true)
      })
      
      this.socket.on('disconnect', () => {
        console.log('Socket disconnected')
        this.$store.commit('setSocketConnected', false)
      })
      
      // Listen for file events
      this.socket.on('fileUploaded', (data) => {
        this.toast.success(`New file uploaded: ${data.name}`)
        this.$store.dispatch('refreshFiles')
      })
      
      this.socket.on('fileDownloaded', (data) => {
        console.log(`File downloaded: ${data.name}`)
      })
      
      this.socket.on('fileDeleted', (data) => {
        this.toast.info(`File deleted: ${data.name}`)
        this.$store.dispatch('refreshFiles')
      })
      
      // Listen for share events
      this.socket.on('shareCreated', (data) => {
        console.log(`New share created with ${data.files.length} files`)
      })
      
      this.socket.on('shareDownloaded', (data) => {
        console.log(`Share downloaded: ${data.id}`)
      })
      
      this.socket.on('shareDeleted', (data) => {
        console.log(`Share deleted: ${data.id}`)
        this.$store.dispatch('refreshShares')
      })
      
      // Listen for active users count
      this.socket.on('activeUsers', (data) => {
        this.$store.commit('setActiveUsers', data.count)
      })
    }
  },
  beforeUnmount() {
    // Disconnect socket when component is unmounted
    if (this.socket) {
      this.socket.disconnect()
    }
  }
}
</script>
