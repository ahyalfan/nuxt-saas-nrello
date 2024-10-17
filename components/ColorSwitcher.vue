<script setup>
import { Sunny, Moon } from "@element-plus/icons-vue";
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
</script>

<template>
  <!-- <ClientOnly> -->
  <!-- <UButton :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'" color="gray" variant="ghost"
      aria-label="Theme" @click="isDark = !isDark" /> -->
  <el-button color="white" size="large" :icon="isDark ? Moon : Sunny" />

  <!-- <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly> -->
</template>
