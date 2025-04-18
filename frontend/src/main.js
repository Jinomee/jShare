import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/tailwind.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import axios from 'axios'

// Configure axios base URL
const backendUrl = process.env.NODE_ENV === 'production' 
  ? window.location.origin
  : 'http://localhost:3000'
  
axios.defaults.baseURL = backendUrl

// Toast notification options
const toastOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
}

createApp(App)
  .use(store)
  .use(router)
  .use(Toast, toastOptions)
  .mount('#app')
