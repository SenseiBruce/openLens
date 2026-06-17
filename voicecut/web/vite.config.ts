import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': process.env.API_TARGET || 'http://localhost:8000',
      '/files': process.env.API_TARGET || 'http://localhost:8000',
    }
  }
})
