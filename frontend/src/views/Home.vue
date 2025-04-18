<template>
  <div>
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-primary-600 mb-4">Welcome to jShare</h1>
      <p class="text-xl text-secondary-600 max-w-2xl mx-auto">
        A modern, minimalistic file sharing platform that makes sharing files across devices simple and secure.
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <div class="card p-6">
        <div class="text-primary-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-secondary-800 mb-2 text-center">Upload Files</h2>
        <p class="text-secondary-600 text-center mb-4">
          Quickly upload files of any type up to 1GB in size.
        </p>
        <div class="text-center">
          <router-link to="/upload" class="btn btn-primary">
            Upload Now
          </router-link>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="text-primary-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-secondary-800 mb-2 text-center">Share Files</h2>
        <p class="text-secondary-600 text-center mb-4">
          Generate shareable links to send files to anyone, anywhere.
        </p>
        <div class="text-center">
          <router-link to="/files" class="btn btn-primary">
            My Files
          </router-link>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="text-primary-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-secondary-800 mb-2 text-center">Secure Transfers</h2>
        <p class="text-secondary-600 text-center mb-4">
          Set expiration times for shared links to maintain control over your files.
        </p>
        <div class="text-center">
          <router-link to="/about" class="btn btn-primary">
            Learn More
          </router-link>
        </div>
      </div>
    </div>
    
    <div class="mt-16 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-secondary-800 mb-6 text-center">How It Works</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="bg-primary-100 text-primary-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="font-bold text-xl">1</span>
          </div>
          <h3 class="font-semibold text-secondary-800 mb-2">Upload Your Files</h3>
          <p class="text-secondary-600">
            Select and upload files from your device with our simple interface.
          </p>
        </div>
        
        <div class="text-center">
          <div class="bg-primary-100 text-primary-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="font-bold text-xl">2</span>
          </div>
          <h3 class="font-semibold text-secondary-800 mb-2">Create Share Links</h3>
          <p class="text-secondary-600">
            Generate secure links to share with others via email, messaging, or social media.
          </p>
        </div>
        
        <div class="text-center">
          <div class="bg-primary-100 text-primary-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="font-bold text-xl">3</span>
          </div>
          <h3 class="font-semibold text-secondary-800 mb-2">Recipients Download</h3>
          <p class="text-secondary-600">
            Recipients can access and download your files without needing an account.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
