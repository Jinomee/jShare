<template>
  <div class="flex flex-col items-center justify-center py-16">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-secondary-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h1 class="text-4xl font-bold text-secondary-800 mb-4">404</h1>
    <h2 class="text-2xl font-semibold text-secondary-700 mb-6">Page Not Found</h2>
    <p class="text-secondary-600 mb-8 text-center max-w-md">
      The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
    </p>
    <router-link to="/" class="btn btn-primary">
      Go Home
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>
