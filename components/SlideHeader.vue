<script lang="ts" setup>
defineProps<{
  title: string;
  onClick: () => void;
}>();
</script>
<template>
  <div class="flex dark:border-gray-800">
    <h3 class="font-semibold">{{ title }}</h3>
    <el-button @click="onClick">
      <!-- <el-icon>
        <Close />
      </el-icon> -->
    </el-button>
  </div>
</template>

<style></style>
