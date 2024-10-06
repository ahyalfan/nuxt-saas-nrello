// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-10-06",
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-mongoose",
    "@element-plus/nuxt",
  ],
  
  nuxtServerUtils: {
    mongodbUri: process.env.MONGODB_URI,
  },
})