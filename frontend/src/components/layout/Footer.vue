<template>
  <footer class="bg-white border-t border-secondary-200 mt-4">
    <div class="container mx-auto px-4 py-3">
      <div class="text-center">
        <div class="text-secondary-500 text-xs">
          &copy; {{ currentYear }} jShare
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>
