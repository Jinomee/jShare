<template>
  <div>
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-primary-600 mb-4">About jShare</h1>
      <p class="text-xl text-secondary-600 max-w-2xl mx-auto">
        A modern, minimalistic file sharing platform built with Vue.js and Node.js
      </p>
    </div>
    
    <div class="max-w-4xl mx-auto">
      <div class="card p-8 mb-8">
        <h2 class="text-2xl font-bold text-secondary-800 mb-4">Our Mission</h2>
        <p class="text-secondary-600 mb-4">
          jShare was created to make file sharing across devices simple, fast, and secure. Our minimalistic approach focuses on what matters most - getting your files from one place to another with minimal friction.
        </p>
        <p class="text-secondary-600">
          Whether you're sharing documents with colleagues, sending photos to family, or transferring files between your own devices, jShare provides a clean, intuitive interface that makes the process seamless.
        </p>
      </div>
      
      <div class="card p-8 mb-8">
        <h2 class="text-2xl font-bold text-secondary-800 mb-4">Features</h2>
        <ul class="space-y-4">
          <li class="flex">
            <div class="flex-shrink-0 mt-1">
              <svg class="h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-semibold text-secondary-800">Simple File Uploads</h3>
              <p class="text-secondary-600">Upload files up to 1GB with our intuitive drag-and-drop interface.</p>
            </div>
          </li>
          <li class="flex">
            <div class="flex-shrink-0 mt-1">
              <svg class="h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-semibold text-secondary-800">Cross-Device Compatibility</h3>
              <p class="text-secondary-600">Access and share files from any device with a web browser.</p>
            </div>
          </li>
          <li class="flex">
            <div class="flex-shrink-0 mt-1">
              <svg class="h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-semibold text-secondary-800">Secure Sharing</h3>
              <p class="text-secondary-600">Generate secure links with optional expiry times to maintain control over your shared files.</p>
            </div>
          </li>
          <li class="flex">
            <div class="flex-shrink-0 mt-1">
              <svg class="h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-semibold text-secondary-800">Real-Time Updates</h3>
              <p class="text-secondary-600">See file transfers and activities in real-time with our socket-based notification system.</p>
            </div>
          </li>
          <li class="flex">
            <div class="flex-shrink-0 mt-1">
              <svg class="h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-semibold text-secondary-800">Minimalistic Design</h3>
              <p class="text-secondary-600">Clean, modern interface built with Vue.js and Tailwind CSS for a seamless user experience.</p>
            </div>
          </li>
        </ul>
      </div>
      
      <div class="card p-8 mb-8">
        <h2 class="text-2xl font-bold text-secondary-800 mb-4">Technology Stack</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold text-secondary-800 mb-2">Frontend</h3>
            <ul class="space-y-2 text-secondary-600">
              <li class="flex items-center">
                <svg class="h-4 w-4 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Vue.js 3
              </li>
              <li class="flex items-center">
                <svg class="h-4 w-4 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Tailwind CSS
              </li>
              <li class="flex items-center">
                <svg class="h-4 w-4 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Vuex for state management
              </li>
              <li class="flex items-center">
                <svg class="h-4 w-4 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Vue Router
              </li>
              <li class="flex items-center">
                <svg class="h-4 w-4 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Axios for HTTP requests
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-secondary-800 mb-2">Backend</h3>
            <ul class="space-y-2 text-secondary-600">
              <li class="flex items-center">
                <svg class="h-4 w-4 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Node.js
              </li>
              <li class="flex items-center">
                <svg class="h-4 w-4 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Express.js
              </li>
              <li class="flex items-center">
                <svg class="h-4 w-4 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Socket.io for real-time communication
              </li>
              <li class="flex items-center">
                <svg class="h-4 w-4 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                File system storage (configurable)
              </li>
              <li class="flex items-center">
                <svg class="h-4 w-4 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                RESTful API architecture
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="card p-8">
        <h2 class="text-2xl font-bold text-secondary-800 mb-4">Open Source</h2>
        <p class="text-secondary-600 mb-4">
          jShare is an open-source project available on GitHub. We welcome contributions from the community to help improve and expand the platform.
        </p>
        <div class="flex justify-center">
          <a href="https://github.com/yourusername/jshare" target="_blank" class="btn btn-primary flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>
