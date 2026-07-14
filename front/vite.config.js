import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 80,
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ['**/node_modules/**', '**/.git/**']
    },
    proxy: {
      '/api': {
        target : process.env.BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true
      },
      '/uploads': {
        target : process.env.BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
