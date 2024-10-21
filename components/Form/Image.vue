<template>
  <div>
    <h2>Upload Multiple Images</h2>
    <input
      type="file"
      @change="onFileChange"
      multiple
      accept="image/png, image/jpeg, image/jpg"
    />
    <button @click="uploadImages">Upload</button>
    <div v-if="imagePreviews.length" style="margin-top: 20px">
      <h3>Image Previews:</h3>
      <div v-for="(image, index) in imagePreviews" :key="index">
        <img :src="image" alt="Preview" style="max-width: 100px; margin-right: 10px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const selectedFiles = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    const validFiles = files.filter((file) => {
      const isImage = file.type === "image/jpeg" || file.type === "image/png";
      return isImage && file.size <= 5 * 1024 * 1024; // Contoh: Maksimal 5 MB
    });

    selectedFiles.value = validFiles;

    // Buat preview
    imagePreviews.value = validFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise<string>((resolve) => {
        reader.onload = () => {
          resolve(reader.result as string);
        };
      });
    });
  }
};

const uploadImages = async () => {
  if (selectedFiles.value.length === 0) {
    alert("Please select image files to upload!");
    return;
  }

  const formData = new FormData();
  selectedFiles.value.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const response = await fetch("YOUR_API_ENDPOINT", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Upload successful:", data);
  } catch (error) {
    console.error("Error uploading the images:", error);
  }
};
</script>

<style scoped>
/* Add some styles here if needed */
</style>
