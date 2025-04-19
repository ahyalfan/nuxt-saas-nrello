import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("QuillEditor", QuillEditor);
});
// ini tidak sekedar vue app.componnte saja tapi bisa lain lain pokoknya yang ada di vue app dari nuxt
// dan bisa lain lain tidak vue app saja misal provide hook dll

// jadi plugin ini untuk menabhkan libary yg tidak terintegrasikan dengan nuxt js, yang mana kita perlu mendaftarkanya terlebih dahulu
