<script lang="ts" setup>
useSeoMeta({
  title: 'nrello',
  ogTitle: 'My Amazing Site',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  twitterCard: 'summary_large_image',
})
</script>
<template>
  <div class="bg-white">
      <NuxtPage />
  </div>
</template>

<style>
body {
  @apply bg-gray-100 dark:bg-gray-900
}
</style>
