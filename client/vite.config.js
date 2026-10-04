import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // In development, /api/... is forwarded to Express. The browser sees one
    // address for the app and the API, the same as once deployed, so the
    // login cookie needs no cross-site special cases.
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
})
