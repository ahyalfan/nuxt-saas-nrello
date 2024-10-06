/** @type {import('tailwindcss').Config} */
export default {
  content: [
    'components/**/*.{vue,js,ts}',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'composables/**/*.{js,ts}',
    'plugins/**/*.{js,ts}',
    'App.{js,ts,vue}',
    'app.{js,ts,vue}',
    'Error.{js,ts,vue}',
    'error.{js,ts,vue}',
    'content/**/*.md',
  ],
  theme: {
    extend: {
      colors: {
        // Tambahkan warna kustom jika perlu
        primary: '#1DA1F2',
        secondary: '#14171A',
        // Dan seterusnya...
      },
    },
  },
  plugins: [],
};
