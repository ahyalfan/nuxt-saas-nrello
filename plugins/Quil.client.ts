import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("QuillEditor", QuillEditor);
});

// jadi plugin ini untuk menabhkan libary yg tidak terintegrasikan dengan nuxt js, yang mana kita perlu mendaftarkanya terlebih dahulu
