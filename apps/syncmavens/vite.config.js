import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client', 'react-router-dom', 'react-icons/ri']
  },
  server: {
    host: '0.0.0.0',
    port: 3002,
    strictPort: true,
    allowedHosts: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3002,
      clientPort: 3002,
    },
    watch: {
      usePolling: true,
      interval: 300,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/backend/**',
        '**/dist/**',
        '**/__pycache__/**',
      ],
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
      }
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 3002,
    strictPort: true,
    allowedHosts: true,
  },
})
