// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-10-06",
  modules: ["@nuxtjs/tailwindcss", "nuxt-mongoose", "@element-plus/nuxt", "@sidebase/nuxt-auth", "@nuxtjs/color-mode"],
  app: {
    head: {
      title: "nrello",
      link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }]
    }
  },

  // ini runtime configuration yg akan bisa diakses di nuxtnya nanti
  runtimeConfig: {
    auth: {
      origin: process.env.AUTH_ORIGIN,
      secret: process.env.AUTH_SECRET,
    },
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    public: {
      pixabayApiKey: process.env.PIXABAY_API_KEY,
      priceId: process.env.STRIPE_PRICE_ID,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
    },
  },

  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: "authjs",
    },
  },
  // jika pakai github
  //  auth: {
  //   strategies: {
  //     github: {
  //       scheme: 'oauth2',
  //       endpoints: {
  //         authorization: 'https://github.com/login/oauth/authorize',
  //         token: 'https://github.com/login/oauth/access_token',
  //         userInfo: 'https://api.github.com/user',
  //       },
  //       clientId: process.env.GITHUB_CLIENT_ID || useRuntimeConfig().auth.github.clientId,
  //       codeChallengeMethod: '',
  //     },
  //   },
  colorMode: {
    preference: 'Light',
  },
  nuxtServerUtils: {
    mongodbUri: process.env.MONGODB_URI,
  },
})


// Sidebase Auth di Nuxt digunakan untuk mengelola otentikasi pengguna dalam aplikasi yang dibangun menggunakan framework Nuxt.js. Dengan Sidebase Auth, Anda bisa:

// Membuat Akun Pengguna: Memungkinkan pengguna mendaftar untuk akun baru.
// Login dan Logout: Menyediakan fungsi untuk masuk dan keluar dari aplikasi dengan aman.
// Manajemen Sesi: Mengelola sesi pengguna untuk memastikan pengalaman yang konsisten saat berinteraksi dengan aplikasi.
// Integrasi Sosial: Mendukung otentikasi melalui layanan pihak ketiga seperti Google atau Facebook.
// Keamanan: Menyediakan lapisan keamanan tambahan untuk melindungi data pengguna.
// Dengan menggunakan Sidebase Auth, Anda bisa lebih mudah mengimplementasikan fitur-fitur otentikasi ini tanpa perlu membuat sistem dari nol.
